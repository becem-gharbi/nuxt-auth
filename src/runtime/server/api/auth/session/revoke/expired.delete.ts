import { defineEventHandler } from "h3";
import {
  handleError,
  deleteManyRefreshTokenExpired,
  privateConfig,
} from "#auth";
import { getRequestHeader } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const webhooksKey = privateConfig.webhooksKey;

    if (!webhooksKey) {
      throw new Error(
        "Please make sure to set webhooks key in auth config option"
      );
    }

    if (getRequestHeader(event, "Webhook-Key") !== webhooksKey) {
      throw new Error("unauthorized");
    }

    await deleteManyRefreshTokenExpired();

    return {};
  } catch (error) {
    await handleError(error);
  }
});
