import { H3Event } from "h3";

export default defineEventHandler((event) => {
  const auth = event.context.auth;
  return auth;
});
