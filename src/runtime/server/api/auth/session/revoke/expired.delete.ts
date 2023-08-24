import { defineEventHandler } from "h3";
import { handleError, deleteManyRefreshTokenExpired, getConfig } from "#auth";
import { getRequestHeader } from "h3";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  try {
    const webhookKey = config.private.webhookKey;

    if (!webhookKey) {
      throw new Error(
        "Please make sure to set Webhook Key in auth config option"
      );
    }

    if (getRequestHeader(event, "Webhook-Key") !== webhookKey) {
      throw new Error("unauthorized");
    }

    await deleteManyRefreshTokenExpired(event);

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
