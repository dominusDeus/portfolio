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
const KV_KEY = "idu_schedule_signature_v2";
const DEFAULT_SIGNATURE = "";

// Create Redis client from REDIS_URL (Redis Cloud or equivalent). Reuse across invocations.
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

type ScheduleEntry = {
  month: string;
  range: string;
  cutoff: string;
};

function parseScheduleFromHtml(html: string): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];

  const normalized = html
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const monthName =
    "Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre";
  const monthRegex = new RegExp(`(${monthName})\\s+\\d{4}`, "gi");
  const rangeRegex = /desde\s+NW-\d{4}-\d{5,6}\s+hasta\s+NW-\d{4}-\d{5,6}/i;
  const cutoffRegex = /registrados\s+hasta\s+(\d{2}[\/-]\d{2}[\/-]\d{4})/i;

  let match: RegExpExecArray | null;
  const monthMatches: { text: string; index: number }[] = [];
  while ((match = monthRegex.exec(normalized)) !== null) {
    monthMatches.push({ text: match[0], index: match.index });
  }

  for (let i = 0; i < monthMatches.length; i++) {
    const current = monthMatches[i];
    const next = monthMatches[i + 1];
    const sliceEnd = next
      ? next.index
      : Math.min(current.index + 1500, normalized.length);
    const vicinity = normalized.slice(current.index, sliceEnd);

    const rangeMatch = vicinity.match(rangeRegex);
    const cutoffMatch = vicinity.match(cutoffRegex);

    if (rangeMatch) {
      const rangeText = rangeMatch[0].replace(/\s+/g, " ");
      const cutoffText = cutoffMatch
        ? `registrados hasta ${cutoffMatch[1].replace(/\-/g, "/")}`
        : "registrados hasta N/D";
      entries.push({
        month: current.text,
        range: rangeText,
        cutoff: cutoffText,
      });
    }
  }

  return entries;
}

async function sendNotificationEmail(
  email: string,
  schedule: ScheduleEntry[],
  changed: boolean
) {
  const from =
    process.env.RESEND_FROM ||
    "Natalia Carrera <idu-tracker@nataliacarrera.com>";
  const to = email;
  const subject = changed
    ? `LMD IDU: NUEVAS HABILITACIONES 🎉`
    : `LMD IDU: sin cambios (última información)`;

  const listItems = schedule
    .map(
      (e) =>
        `<li><strong>${e.month}</strong>: ${e.range}<br/><em>${e.cutoff}</em></li>`
    )
    .join("");

  const html = `
    ${
      changed
        ? "<p><strong>Se detectaron cambios en las habilitaciones de IDU.</strong></p>"
        : "<p><strong>No hubo cambios desde el último chequeo.</strong></p>"
    }
    <p>Próximas habilitaciones publicadas:</p>
    <ul>${listItems}</ul>
    <p>Fuente: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
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
    const schedule = parseScheduleFromHtml(html);
    if (!schedule || schedule.length === 0) {
      console.warn("Could not extract schedule from HTML.");
      return new Response("No schedule found", { status: 200 });
    }

    // Build a signature from schedule for change detection
    const signature = schedule
      .map((e) => `${e.month}|${e.range}|${e.cutoff}`)
      .join(";");

    // Read last seen signature from Redis if available; fall back to default on first run
    const lastSeen = redis
      ? ((await redis.get(KV_KEY)) as string | null)
      : DEFAULT_SIGNATURE;

    const changed = lastSeen ? signature !== lastSeen : true;

    // Fetch subscribers from Firestore and notify accordingly
    const subscribers = await listIduSubscribers();
    const successes: string[] = [];
    const failures: { email: string; error: unknown }[] = [];

    await Promise.all(
      (
        await await subscribers
      ).map(async (subscriber) => {
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
            schedule,
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

    // Store the latest signature for next comparison (if Redis is configured)
    if (redis) {
      await redis.set(KV_KEY, signature);
    }

    const summary = {
      changed,
      lastSeen: lastSeen ?? "N/A",
      signature,
      schedule,
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
