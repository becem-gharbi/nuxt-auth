import { defineEventHandler } from "h3";
import {
  handleError,
  deleteManyRefreshTokenExpired,
  privateConfig,
} from "#auth";
import { getRequestHeader } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const webhookKey = privateConfig.webhookKey;

    if (!webhookKey) {
      throw new Error(
        "Please make sure to set Webhook Key in auth config option"
      );
    }

    if (getRequestHeader(event, "Webhook-Key") !== webhookKey) {
      throw new Error("unauthorized");
    }

    await deleteManyRefreshTokenExpired();

    return {};
  } catch (error) {
    await handleError(error);
  }
});
