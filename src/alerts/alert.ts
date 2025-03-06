import { MessageBuilder } from "webhook-discord";
import hook from "./index";
import fs from "fs";
import path from "path";
import { formatDate } from "../cron/utils";

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

function logMessage(sender: string, message: string, level: string): void {
  // Vérifier si on doit logger le message
  // if (!shouldLog(sender, message)) {
  //   return;
  // }

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

export { sendWarn, sendInfo, sendError, sendSuccess, sendSend };
