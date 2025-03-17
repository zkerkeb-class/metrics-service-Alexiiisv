import { MessageBuilder } from "webhook-discord";
import hook from "./index";
import fs from "fs";
import path from "path";
import { formatDate } from "../cron/utils";
import { SERVICES_TO_MONITOR } from "../constant";

interface LogEntry {
  date: string;
  severity: string;
  sender: string;
  message: string;
}

const logFilePath = path.join(
  __dirname,
  `../storage/${formatDate(new Date())}.json`
);

const DEBOUNCE_INTERVAL = 10 * 60 * 1000; // 10 minutes en millisecondes

function shouldLog(sender: string, message: string): boolean {
  let logs: LogEntry[] = [];

  // Lire le fichier JSON existant s'il existe
  if (fs.existsSync(logFilePath)) {
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    try {
      logs = JSON.parse(fileContent);
    } catch (error) {
      logs = [];
    }
  }

  // Trouver le dernier log pour ce sender et ce message
  const lastLog = logs
    .filter((log: LogEntry) => log.sender === sender && log.message === message)
    .sort(
      (a: LogEntry, b: LogEntry) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

  // Si c'est le premier message ou si le message a changé, on log
  if (!lastLog) {
    return true;
  }

  // Si le dernier log date de plus de 10 minutes, on log
  const lastLogTime = new Date(lastLog.date).getTime();
  const now = Date.now();
  if (now - lastLogTime >= DEBOUNCE_INTERVAL) {
    return true;
  }

  return false;
}

function getLatestStatuses(): Map<
  string,
  { isOnline: boolean; message: string }
> {
  const logFilePath = path.join(
    __dirname,
    `../storage/${formatDate(new Date())}.json`
  );
  const statuses = new Map<string, { isOnline: boolean; message: string }>();

  if (fs.existsSync(logFilePath)) {
    try {
      const logs: LogEntry[] = JSON.parse(
        fs.readFileSync(logFilePath, "utf-8")
      );

      // Groupe les logs par sender et prend le plus récent
      SERVICES_TO_MONITOR.forEach((service) => {
        const latestLog = logs
          .filter((log) => log.sender === service.name)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

        if (latestLog) {
          statuses.set(service.name, {
            isOnline: latestLog.severity === "INFO",
            message: latestLog.message,
          });
        }
      });
    } catch (error) {
      console.error("Erreur lors de la lecture des logs:", error);
    }
  }
  return statuses;
}

function sendStatusRecap(
  results: Array<{ name: string; isOnline: boolean; message: string }>
) {
  const previousStatuses = getLatestStatuses();

  // Vérifie si un statut a changé
  const hasStatusChanged = results.some((result) => {
    const previous = previousStatuses.get(result.name);
    return !previous || previous.isOnline !== result.isOnline;
  });

  if (hasStatusChanged) {
    const msg = new MessageBuilder()
      .setName("Status Monitor")
      .setColor("#00ff00")
      .setTitle("📊 État des Services")
      .setText("@everyone");

    const onlineServices = results
      .filter((r) => r.isOnline)
      .map((r) => {
        return `${r.name}`;
      })
      .join("\n");

    const offlineServices = results
      .filter((r) => !r.isOnline)
      .map((r) => {
        return `${r.name}`;
      })
      .join("\n");

    let description = "**🟢 Services En Ligne:**\n";
    description += onlineServices || "Aucun\n";
    description += "\n**🔴 Services Hors Ligne:**\n";
    description += offlineServices || "Aucun";

    msg.setDescription(description);
    sendSend(msg);
  }
}

function logMessage(sender: string, message: string, level: string): void {
  let logs: LogEntry[] = [];

  // Lire le fichier JSON existant s'il existe
  if (fs.existsSync(logFilePath)) {
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    try {
      logs = JSON.parse(fileContent);
    } catch (error) {
      logs = [];
    }
  }

  // Ajouter le nouveau log
  logs.push({
    date: new Date().toISOString(),
    severity: level,
    sender: sender,
    message: message,
  });

  // Écrire le fichier JSON mis à jour
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

function sendWarn(sender: string, message: string): void {
  if (!sender || !message) return;
  if (shouldLog(sender, message)) {
    logMessage(sender, message, "WARN");
    if (hook) hook.warn(sender, message);
  }
}

function sendInfo(sender: string, message: string): void {
  if (!sender || !message) return;
  if (shouldLog(sender, message)) {
    logMessage(sender, message, "INFO");
    if (hook) hook.info(sender, message);
  }
}

function sendError(sender: string, message: string): void {
  if (!sender || !message) return;
  if (shouldLog(sender, message)) {
    logMessage(sender, message, "ERROR");
    if (hook) hook.err(sender, message);
  }
}

function sendSuccess(sender: string, message: string): void {
  if (!sender || !message) return;
  if (shouldLog(sender, message)) {
    if (hook) hook.success(sender, message);
  }
}

function sendSend(message: MessageBuilder): void {
  if (!message) return;
  if (hook) hook.send(message);
}

export {
  sendWarn,
  sendInfo,
  sendError,
  sendSuccess,
  sendSend,
  sendStatusRecap,
};
