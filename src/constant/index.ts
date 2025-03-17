import { MessageBuilder } from "webhook-discord";

export const WentOffline: MessageBuilder = new MessageBuilder()
  .setName("API")
  .setColor("#696969")
  .setText("Went Offline")
  .setDescription("Went Offline");

export const WentOnline: MessageBuilder = new MessageBuilder()
  .setName("API")
  .setColor("#696969")
  .setText("Went Online")
  .setDescription("Went Online");

export const stillOffline: MessageBuilder = new MessageBuilder()
  .setName("API")
  .setColor("#696969")
  .setText("Still Offline")
  .setDescription("Still Offline");

export const SERVICES_TO_MONITOR = [
  {
    url: "https://speautyfayye.ckx.app/fr/",
    name: "Front",
  },
  {
    url: `${process.env.NOTIFICATION_SERVICE_URL}/health`,
    name: "Notification Service",
  },
  {
    url: `${process.env.AUTH_SERVICE_URL}/health`,
    name: "Authentification Service",
  },
];
