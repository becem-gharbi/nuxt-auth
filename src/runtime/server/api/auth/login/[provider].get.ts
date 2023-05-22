import { defineEventHandler, sendRedirect, getQuery } from "h3";
import { privateConfig, publicConfig, handleError } from "#auth";
import { resolveURL, withQuery } from "ufo";

export default defineEventHandler(async (event) => {
  const provider = event.context.params!.provider;

  if (!privateConfig.oauth || !privateConfig.oauth[provider]) {
    throw new Error("oauth-not-configured");
  }

  // The protected page the user has visited before redirect to login page
  const returnToPath = getQuery(event)?.redirect;

  try {
    const redirectUri = resolveURL(
      publicConfig.baseUrl,
      "/api/auth/login",
      provider,
      "callback"
    );

    const authorizationUrl = withQuery(
      privateConfig.oauth[provider].authorizeUrl,
      {
        response_type: "code",
        scope: privateConfig.oauth[provider].scopes,
        redirect_uri: redirectUri,
        client_id: privateConfig.oauth[provider].clientId,
        state: returnToPath,
      }
    );

    await sendRedirect(event, authorizationUrl);
  } catch (error) {
    await handleError(error);
  }
});
