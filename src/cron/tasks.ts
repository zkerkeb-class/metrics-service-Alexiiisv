import cron from "node-cron";
import { sendInfo, sendWarn } from "../alerts/alert";

export const notOnline: cron.ScheduledTask = cron.schedule("0 * * * *", () => {
  sendWarn("Cron", "This is a cron job running every hour");
});

cron.schedule("*/15 * * * * *", () => {
  fetch("https://speautyfayye.ckx.app/fr/").then((response) => {
    if (response.ok) sendInfo("Front", "Online");
    else sendWarn("Front", "Offline");
  });
});

// Monitoring du Service de Notification
// S'exécute toutes les 15 secondes
// Vérifie l'endpoint /health qui renvoie le statut du service
cron.schedule("*/15 * * * * *", () => {
  fetch("http://localhost:3000/health").then((response) => {
    // Si le service répond avec un statut 2xx
    if (response.ok) sendInfo("Notification Service", "Online");
    // Si le service ne répond pas ou renvoie une erreur
    else sendWarn("Notification Service", "Offline");
  });
});

// export const notOnline: cron.ScheduledTask = cron.schedule(
//   "* * * * * *",
//   () => {
//     sendWarn("Cron", "This is a cron job running every second");
//   }
// );
