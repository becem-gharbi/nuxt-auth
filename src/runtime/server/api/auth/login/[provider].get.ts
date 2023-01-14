import { defineEventHandler, createError, sendRedirect } from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const provider = event.context.params.provider;

  try {
    const authorizationUrl =
      config.auth.oauth[provider].authorizeUrl +
      "?" +
      "response_type=code" +
      "&" +
      "scope=email profile" +
      "&" +
      `redirect_uri=${config.public.auth.baseUrl}/api/auth/login/${provider}/callback` +
      "&" +
      `client_id=${config.auth.oauth[provider].clientId}`;

    await sendRedirect(event, authorizationUrl);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
