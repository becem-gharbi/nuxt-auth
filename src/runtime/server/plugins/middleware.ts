import { defineNitroPlugin } from "#imports";
import { getAccessTokenFromHeader, verifyAccessToken } from "#auth";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    const accessToken = getAccessTokenFromHeader(event);

    if (accessToken) {
      await verifyAccessToken(event, accessToken)
        .then((p) => (event.context.auth = p))
        .catch();
    }
  });
});
