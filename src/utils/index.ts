import cron from "node-cron";
import {
  DEBOUNCE_INTERVAL,
  LogEntry,
  LOG_FILE_PATH,
  SERVICES_TO_MONITOR,
} from "../constant";
import fs from "fs";
import path from "path";

function stopCronJob(task: cron.ScheduledTask) {
  task.stop();
  console.log(`task has been stopped`);
}

function startCronJob(task: cron.ScheduledTask) {
  task.start();
  console.log(`task has been started`);
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
}

function shouldLog(sender: string, message: string): boolean {
  let logs: LogEntry[] = [];

  // Lire le fichier JSON existant s'il existe
  if (fs.existsSync(LOG_FILE_PATH)) {
    const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf-8");
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

function logMessage(sender: string, message: string, level: string): void {
  let logs: LogEntry[] = [];

  // Lire le fichier JSON existant s'il existe
  if (fs.existsSync(LOG_FILE_PATH)) {
    const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf-8");
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
  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
}

export {
  stopCronJob,
  startCronJob,
  formatDate,
  shouldLog,
  getLatestStatuses,
  logMessage,
};
