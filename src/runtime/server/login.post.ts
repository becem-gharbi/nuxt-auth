import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {

  return { ok: true };
});
