import { defineEventHandler } from "h3";
import { getConfig, handleError } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const config = getConfig(event);
    return { config };
  } catch (error) {
    await handleError(error);
  }
});
