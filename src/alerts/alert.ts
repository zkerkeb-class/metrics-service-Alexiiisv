import { MessageBuilder } from "webhook-discord";
import hook from "./index";
import { getLatestStatuses, logMessage, shouldLog } from "../utils";

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
