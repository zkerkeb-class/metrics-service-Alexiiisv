import express from "express";
import dotenv from "dotenv";
import { servicesCheck } from "./cron/tasks";
import { startCronJob } from "./utils";
import { sendSend } from "./alerts/alert";
import type { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Démarrer toutes les tâches CRON
startCronJob(servicesCheck);

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello World!");
});

// Route de santé
app.get("/health", (req: Request, res: Response) => {
  return res.json({ status: "OK", service: "monitoring-service" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
