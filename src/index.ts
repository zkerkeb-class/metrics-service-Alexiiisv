import express from "express";
import dotenv from "dotenv";
import { servicesCheck } from "./cron/tasks";
import { startCronJob } from "./utils";
import { sendSend } from "./alerts/alert";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Démarrer toutes les tâches CRON
startCronJob(servicesCheck);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
