import { Webhook } from "webhook-discord";

const hook = new Webhook(
  "https://discord.com/api/webhooks/1337005135074951240/PnHi6rvfJ6HPgTJ-EzTbbw4yBr0KqAjxEhq4YQgwStRDETUSDmQmT7orO0MnaaanBpmT"
);
// const hook = new Webhook(process.env.DISCORD_URL || "");

export default hook;
