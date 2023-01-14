import {
  defineEventHandler,
  readBody,
  createError,
  setCookie,
  deleteCookie,
} from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    deleteCookie(event, config.public.auth.refreshTokenCookieName);
    return { ok: true };
  } catch (error) {}
});
