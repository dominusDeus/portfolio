import Redis from "ioredis";
import { Resend } from "resend";
import { listIduSubscribers } from "@/lib/firestore";
import pThrottle from "p-throttle";

export const dynamic = "force-dynamic";
const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

const throttle = pThrottle({
  limit: 1,
  interval: 1000,
});

const throttled = throttle((...args: Parameters<typeof resend.emails.send>) =>
  resend.emails.send(...args)
);

const TARGET_URL =
  "https://www.exteriores.gob.es/Consulados/buenosaires/es/Comunicacion/Noticias/Paginas/Articulos/202200907_NOT02.aspx";
const KV_KEY = "idu_last_seen_date";
const DEFAULT_DATE = "15/02/2024";

// Create Redis client from REDIS_URL (Redis Cloud or equivalent). Reuse across invocations.
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

function extractDateFromHtml(html: string): string | null {
  // Tolerant regex: look for the key phrase and capture dd/mm/yyyy inside a span
  const pattern =
    /IDU[sS]?\s+registrados\s+al[\s\S]*?<span[^>]*>\s*(\d{2}[\/-]\d{2}[\/-]\d{4})\s*<\/span>/i;
  const match = html.match(pattern);
  if (match && match[1]) {
    // Normalize separator to '/'
    return match[1].replace(/-/g, "/");
  }
  // Fallback: broader date search near the headline
  const vicinityPattern =
    /se\s+han\s+habilitado\s+los\s+IDU[sS]?.{0,300}?(\d{2}[\/-]\d{2}[\/-]\d{4})/i;
  const near = html.match(vicinityPattern);
  return near ? near[1].replace(/-/g, "/") : null;
}

async function sendNotificationEmail(
  email: string,
  oldDate: string | null,
  newDate: string,
  changed: boolean
) {
  const from =
    process.env.RESEND_FROM ||
    "Natalia Carrera <idu-tracker@nataliacarrera.com>";
  const to = email;
  const subject = changed
    ? `LMD IDU ACTUALIZARON!! 🎉 : ${oldDate ?? "N/A"} → ${newDate}`
    : `LMD IDU (no hubo cambios): ${newDate}`;
  const html = changed
    ? `
    <p><strong>Hubo una actualización en la fecha de IDUs!!!</strong></p>
    <p><strong>Fecha publicada:</strong> ${
      oldDate ?? "N/A"
    }<br/><strong>Current:</strong> ${newDate}</p>
    <p>Link a la página: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
    <p>Para desuscribirte, podés hacer click <a href="https://www.nataliacarrera.com/idu/formulario-inscripcion">aquí</a></p>
  `
    : `
    <p><strong>No hubo actualización en la fecha de IDUs.</strong></p>
    <p><strong>Fecha publicada:</strong> ${newDate}</p>
    <p>Link a la página: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
    <br/><br/>
    <p>Para desuscribirte, podés hacer click <a href="https://www.nataliacarrera.com/idu/formulario-inscripcion">aquí</a></p>
  `;
  console.log("sending email to", to);
  // Resend SDK returns { data, error }

  const result = (await throttled({ from, to, subject, html })) as
    | { data?: { id?: string } | null; error?: { message?: string } | null }
    | unknown;
  return result as any;
}

export async function GET() {
  try {
    const response = await fetch(TARGET_URL, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IDU-Watcher/1.0)" },
      // Avoid caching proxies returning stale HTML
      cache: "no-store",
    });
    if (!response.ok) {
      return new Response(`Fetch failed: ${response.status}`, { status: 502 });
    }
    const html = await response.text();
    const extracted = extractDateFromHtml(html);
    if (!extracted) {
      console.warn("Could not extract date from HTML.");
      return new Response("No date found", { status: 200 });
    }

    // Read last seen date from Redis if available; fall back to default on first run
    const lastSeen = redis
      ? ((await redis.get(KV_KEY)) as string | null)
      : DEFAULT_DATE;

    const changed = lastSeen ? extracted !== lastSeen : true;

    // Fetch subscribers from Firestore and notify accordingly
    const subscribers = await listIduSubscribers();
    const successes: string[] = [];
    const failures: { email: string; error: unknown }[] = [];

    await Promise.all(
      subscribers.map(async (subscriber) => {
        // Skip if unsubscribed
        // Note: listIduSubscribers already filters unsubscribed, this is an extra guard
        const isUnsubscribed = Boolean((subscriber as any).unsubscribedAt);
        const shouldSendEmail =
          !isUnsubscribed && (subscriber.wantsDailyUpdates || changed);
        if (!shouldSendEmail) {
          console.log(
            `skip sending to ${subscriber.email}: unsubscribed=${isUnsubscribed} wantsDailyUpdates=${subscriber.wantsDailyUpdates} changed=${changed}`
          );
          return;
        }
        try {
          const res = (await sendNotificationEmail(
            subscriber.email,
            lastSeen,
            extracted,
            changed
          )) as any;
          const errMsg = res?.error?.message;
          const mailId = res?.data?.id;
          if (errMsg) {
            console.error(`send failed for ${subscriber.email}: ${errMsg}`);
            failures.push({ email: subscriber.email, error: errMsg });
          } else {
            console.log(`sent to ${subscriber.email}: id=${mailId ?? "n/a"}`);
            successes.push(subscriber.email);
          }
        } catch (error) {
          console.error(`send failed for ${subscriber.email}`, error);
          failures.push({ email: subscriber.email, error });
        }
      })
    );

    // Store the latest date for next comparison (if Redis is configured)
    if (redis) {
      await redis.set(KV_KEY, extracted);
    }

    const summary = {
      changed,
      lastSeen: lastSeen ?? "N/A",
      current: extracted,
      attempted: subscribers.length,
      sent: successes.length,
      failed: failures.length,
      failures,
    };
    return new Response(JSON.stringify(summary), {
      status: failures.length > 0 ? 207 : 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Handler error", error);
    return new Response("Internal error", { status: 500 });
  }
}
