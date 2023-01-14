import { defineEventHandler, createError, sendRedirect } from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const authorizationUrl =
      config.auth.oauthAuthorizeUrl +
      "?" +
      "response_type=code" +
      "&" +
      "scope=email profile" +
      "&" +
      `redirect_uri=${config.public.auth.baseUrl}/api/auth/login/google/callback` +
      "&" +
      `client_id=${config.auth.oauthClientId}`;

    await sendRedirect(event, authorizationUrl);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
