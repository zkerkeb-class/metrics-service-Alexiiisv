import cron from "node-cron";
import { sendInfo, sendStatusRecap, sendWarn } from "../alerts/alert";
import { SERVICES_TO_MONITOR } from "../constant";

const TIMEOUT_MS = 5000; // 5 secondes de timeout

async function checkService(
  url: string,
  serviceName: string
): Promise<{
  name: string;
  isOnline: boolean;
  message: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      return { name: serviceName, isOnline: true, message: "Online" };
    } else {
      return {
        name: serviceName,
        isOnline: false,
        message: `Offline (Status: ${response.status})`,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          name: serviceName,
          isOnline: false,
          message: "Offline (Timeout)",
        };
      } else if (error.message.includes("ECONNREFUSED")) {
        return {
          name: serviceName,
          isOnline: false,
          message: "Offline (Connection Refused)",
        };
      } else {
        return {
          name: serviceName,
          isOnline: false,
          message: `Offline (Error: ${error.message})`,
        };
      }
    }
    return {
      name: serviceName,
      isOnline: false,
      message: "Offline (Unknown Error)",
    };
  }
}

// Monitoring de tous les services
// S'exécute toutes les 15 secondes
export const servicesCheck: cron.ScheduledTask = cron.schedule(
  "*/15 * * * * *",
  async () => {
    const results = await Promise.all(
      SERVICES_TO_MONITOR.map((service) =>
        checkService(service.url, service.name)
      )
    );
    sendStatusRecap(results);

    results.forEach((result) => {
      if (result.isOnline) {
        sendInfo(result.name, result.message);
      } else {
        sendWarn(result.name, result.message);
      }
    });
  }
);
