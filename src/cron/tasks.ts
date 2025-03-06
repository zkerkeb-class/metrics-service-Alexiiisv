import cron from "node-cron";
import { sendInfo, sendWarn } from "../alerts/alert";

const TIMEOUT_MS = 5000; // 5 secondes de timeout

async function checkService(url: string, serviceName: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      sendInfo(serviceName, "Online");
    } else {
      sendWarn(serviceName, `Offline (Status: ${response.status})`);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        sendWarn(serviceName, "Offline (Timeout)");
      } else if (error.message.includes("ECONNREFUSED")) {
        sendWarn(serviceName, "Offline (Connection Refused)");
      } else {
        sendWarn(serviceName, `Offline (Error: ${error.message})`);
      }
    }
  }
}

export const frontendCheck: cron.ScheduledTask = cron.schedule(
  "*/15 * * * * *",
  () => {
    checkService("https://speautyfayye.ckx.app/fr/", "Front");
  }
);

// Monitoring du Service de Notification
// S'exécute toutes les 15 secondes
// Vérifie l'endpoint /health qui renvoie le statut du service
export const notificationServiceCheck: cron.ScheduledTask = cron.schedule(
  "*/15 * * * * *",
  () => {
    checkService(
      `${process.env.NOTIFICATION_SERVICE_URL}/health`,
      "Notification Service"
    );
  }
);

// Monitoring du Service d'Authentification
// S'exécute toutes les 15 secondes
// Vérifie l'endpoint /health qui renvoie le statut du service
export const authServiceCheck: cron.ScheduledTask = cron.schedule(
  "*/15 * * * * *",
  () => {
    checkService(
      `${process.env.AUTH_SERVICE_URL}/health`,
      "Authentification Service"
    );
  }
);

// export const notOnline: cron.ScheduledTask = cron.schedule(
//   "* * * * * *",
//   () => {
//     sendWarn("Cron", "This is a cron job running every second");
//   }
// );
