import Redis from "ioredis";
import { Resend } from "resend";
import { MAILING_LIST } from "@/app/constants";

export const dynamic = "force-dynamic";

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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set; skipping email notification.");
    return;
  }
  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM ||
    "Natalia Carrera <idu-tracker@nataliacarrera.com>";
  const to = email;
  const subject = changed
    ? `LMD IDU date CHANGED: ${oldDate ?? "N/A"} → ${newDate}`
    : `LMD IDU date (no change): ${newDate}`;
  const html = changed
    ? `
    <p><strong>Hubo una actualización en la fecha de IDUs!!!</strong></p>
    <p><strong>Fecha publicada:</strong> ${
      oldDate ?? "N/A"
    }<br/><strong>Current:</strong> ${newDate}</p>
    <p>Link a la página: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
  `
    : `
    <p><strong>No hubo actualización en la fecha de IDUs.</strong></p>
    <p><strong>Fecha publicada:</strong> ${newDate}</p>
    <p>Link a la página: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
  `;

  await resend.emails.send({ from, to, subject, html });
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

    // Always send an email indicating whether the date changed

    MAILING_LIST.forEach(
      async (contact: { email: string; wantsDailyUpdates: boolean }) => {
        const shouldSendEmail = contact.wantsDailyUpdates || changed;

        if (shouldSendEmail) {
          await sendNotificationEmail(
            contact.email,
            lastSeen,
            extracted,
            changed
          );
        }
      }
    );

    // Store the latest date for next comparison (if Redis is configured)
    if (redis) {
      await redis.set(KV_KEY, extracted);
    }

    return new Response(
      changed
        ? `Email sent (changed): ${lastSeen ?? "N/A"} -> ${extracted}`
        : `Email sent (no change): ${extracted}`,
      { status: 200 }
    );
  } catch (error) {
    console.error("Handler error", error);
    return new Response("Internal error", { status: 500 });
  }
}
