import { defineEventHandler, createError, sendRedirect } from "h3";
import { privateConfig, publicConfig } from "#auth";

export default defineEventHandler(async (event) => {
  const provider = event.context.params.provider;

  if (!privateConfig.oauth || !privateConfig.oauth[provider]) {
    throw new Error("oauth-not-configured");
  }

  try {
    const authorizationUrl =
      privateConfig.oauth[provider].authorizeUrl +
      "?" +
      "response_type=code" +
      "&" +
      `scope=${privateConfig.oauth[provider].scopes}` +
      "&" +
      `redirect_uri=${publicConfig.baseUrl}/api/auth/login/${provider}/callback` +
      "&" +
      `client_id=${privateConfig.oauth[provider].clientId}`;

    await sendRedirect(event, authorizationUrl);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
