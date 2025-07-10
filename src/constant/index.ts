import path from "path";
import { formatDate } from "../utils";

export const SERVICES_TO_MONITOR = [
  {
    url: `${process.env.FRONT_URL}`,
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

export const LOG_FILE_PATH = path.join(
  __dirname,
  `../storage/${formatDate(new Date())}.json`
);

export const DEBOUNCE_INTERVAL = 10 * 60 * 1000; // 10 minutes en millisecondes

export interface LogEntry {
  date: string;
  severity: string;
  sender: string;
  message: string;
}
