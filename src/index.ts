import express from "express";
import dotenv from "dotenv";
import { servicesCheck } from "./cron/tasks";
import { startCronJob } from "./cron/utils";
import { sendSend } from "./alerts/alert";
import { WentOffline } from "./constant";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Démarrer toutes les tâches CRON
startCronJob(servicesCheck);

app.get("/", (req, res) => {
  sendSend(WentOffline);
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
