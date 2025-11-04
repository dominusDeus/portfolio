import Redis from "ioredis";
import { Resend } from "resend";
import { listIduSubscribers } from "@/lib/firestore";
// import { TEST_SUBSCRIBERS } from "@/app/constants";
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
const ONE_TIME_NOTIFICATION_KEY = "idu_one_time_notification_sent";

// Create Redis client from REDIS_URL (Redis Cloud or equivalent). Reuse across invocations.
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

// type ScheduleEntry = {
//   month: string;
//   range: string;
//   cutoff: string;
// };

// function parseScheduleFromHtml(html: string): ScheduleEntry[] {
//   const entries: ScheduleEntry[] = [];

//   const normalized = html
//     .replace(/\r/g, " ")
//     .replace(/\n/g, " ")
//     .replace(/\t/g, " ")
//     .replace(/\s{2,}/g, " ")
//     .trim();

//   const monthName =
//     "Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre";
//   const monthRegex = new RegExp(`(${monthName})\\s+\\d{4}`, "gi");
//   const rangeRegex = /desde\s+NW-\d{4}-\d{5,6}\s+hasta\s+NW-\d{4}-\d{5,6}/i;
//   const cutoffRegex = /registrados\s+hasta\s+(\d{2}[\/-]\d{2}[\/-]\d{4})/i;

//   let match: RegExpExecArray | null;
//   const monthMatches: { text: string; index: number }[] = [];
//   while ((match = monthRegex.exec(normalized)) !== null) {
//     monthMatches.push({ text: match[0], index: match.index });
//   }

//   for (let i = 0; i < monthMatches.length; i++) {
//     const current = monthMatches[i];
//     const next = monthMatches[i + 1];
//     const sliceEnd = next
//       ? next.index
//       : Math.min(current.index + 1500, normalized.length);
//     const vicinity = normalized.slice(current.index, sliceEnd);

//     const rangeMatch = vicinity.match(rangeRegex);
//     const cutoffMatch = vicinity.match(cutoffRegex);

//     if (rangeMatch) {
//       const rangeText = rangeMatch[0].replace(/\s+/g, " ");
//       const cutoffText = cutoffMatch
//         ? `registrados hasta ${cutoffMatch[1].replace(/\-/g, "/")}`
//         : "registrados hasta N/D";
//       entries.push({
//         month: current.text,
//         range: rangeText,
//         cutoff: cutoffText,
//       });
//     }
//   }

//   return entries;
// }

async function sendNotificationEmail(email: string) {
  const from =
    process.env.RESEND_FROM ||
    "Natalia Carrera <idu-tracker@nataliacarrera.com>";
  const to = email;
  const subject = `LMD IDU: Fechas Disponibles - Revisa Disponibilidad`;

  const html = `
    <p><strong>¡Buenas noticias! Las fechas de citas para IDU están abiertas.</strong></p>
    <p>Te recomendamos que revises la disponibilidad de citas lo antes posible en el sitio oficial.</p>
    <p>Fuente: <a href="${TARGET_URL}">${TARGET_URL}</a></p>
    <p><strong>Esta es la última actualización que recibirás.</strong> Ya no enviaremos más actualizaciones automáticas. ¡Gracias por haberte suscrito y espero que haya ayudado 🫶🏻!</p>

Cualquier duda, podés contactarme a través de mi <a href="mailto:nataliacarrera.ads@gmail.com">email</a>.
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
    // Check if one-time notification was already sent
    const alreadySent = redis
      ? ((await redis.get(ONE_TIME_NOTIFICATION_KEY)) as string | null)
      : null;

    if (alreadySent === "true") {
      return new Response(
        JSON.stringify({
          message: "One-time notification already sent",
          skipped: true,
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Fetch subscribers from Firestore
    const subscribers = await listIduSubscribers();

    const successes: string[] = [];
    const failures: { email: string; error: unknown }[] = [];

    await Promise.all(
      subscribers.map(async (subscriber) => {
        try {
          const res = (await sendNotificationEmail(subscriber.email)) as any;
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

    // Mark notification as sent in Redis (only if all emails succeeded or at least some succeeded)
    if (redis && successes.length > 0) {
      await redis.set(ONE_TIME_NOTIFICATION_KEY, "true");
    }

    const summary = {
      attempted: subscribers.length,
      sent: successes.length,
      failed: failures.length,
      successes,
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
