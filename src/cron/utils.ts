import cron from "node-cron";
import { MessageBuilder } from "webhook-discord";

function stopCronJob(task: cron.ScheduledTask) {
  task.stop();
  console.log(`task has been stopped`);
}

function startCronJob(task: cron.ScheduledTask) {
  task.start();
  console.log(`task has been started`);
}

const formatDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
};

export { stopCronJob, startCronJob, formatDate };
