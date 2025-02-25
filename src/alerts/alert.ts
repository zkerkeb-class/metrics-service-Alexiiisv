import { MessageBuilder } from "webhook-discord";
import hook from "./index";
import fs from "fs";
import path from "path";
import { formatDate } from "../cron/utils";

const logFilePath = path.join(
  __dirname,
  `../storage/${formatDate(new Date())}.txt`
);

function logMessage(sender: string, message: string, level: string): void {
  const logEntry = `{"date": "${new Date().toISOString()}", "severity": "${level}", "sender": "${sender}", "message": "${message}"}\n`;
  fs.appendFileSync(logFilePath, logEntry);
}

function sendWarn(sender: string, message: string): void {
  logMessage(sender, message, "WARN");
  hook.warn(sender, message);
}

function sendInfo(sender: string, message: string): void {
  logMessage(sender, message, "INFO");
  hook.info(sender, message);
}

function sendError(sender: string, message: string): void {
  logMessage(sender, message, "ERROR");
  hook.err(sender, message);
}

function sendSuccess(sender: string, message: string): void {
  hook.success(sender, message);
}

function sendSend(message: MessageBuilder): void {
  hook.send(message);
}

export { sendWarn, sendInfo, sendError, sendSuccess, sendSend };
