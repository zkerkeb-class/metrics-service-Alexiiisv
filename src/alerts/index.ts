import { Webhook } from "webhook-discord";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DISCORD_URL) {
  console.warn("⚠️ DISCORD_URL n'est pas défini dans le fichier .env");
}

const hook = process.env.DISCORD_URL
  ? new Webhook(process.env.DISCORD_URL)
  : null;

if (!hook) {
  console.warn("⚠️ Le webhook Discord n'a pas été initialisé");
}

export default hook;
