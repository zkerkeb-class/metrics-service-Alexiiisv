import express from "express";
import dotenv from "dotenv";
import { notOnline } from "./cron/tasks";
import { startCronJob, stopCronJob } from "./cron/utils";
import { sendSend } from "./alerts/alert";
import { WentOffline } from "./constant";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/off", (req, res) => {
  startCronJob(notOnline);
  res.send("Task notOnline has been executed");
});

app.get("/on", (req, res) => {
  stopCronJob(notOnline);
  res.send("Task notOnline has been stopped");
});

app.get("/", (req, res) => {
  sendSend(WentOffline);
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
