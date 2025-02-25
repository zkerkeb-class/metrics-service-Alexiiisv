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

// export const notOnline: cron.ScheduledTask = cron.schedule(
//   "* * * * * *",
//   () => {
//     sendWarn("Cron", "This is a cron job running every second");
//   }
// );
