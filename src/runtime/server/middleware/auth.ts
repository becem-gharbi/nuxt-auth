import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  console.log("IN SERVER MIDDLEWARE");
  event.context.auth = { user: 123 };
});
