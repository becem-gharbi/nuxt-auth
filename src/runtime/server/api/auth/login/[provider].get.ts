import {
  defineEventHandler,
  setCookie,
  createError,
  getCookie,
  sendRedirect,
} from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { Issuer } from "openid-client";
import { generators } from "openid-client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const provider = event.context.params.provider;

  try {
    const issuer = await Issuer.discover(config.auth.providerIssuerUrl);

    const client = new issuer.Client({
      client_id: config.auth.providerClientId,
      client_secret: config.auth.providerClientSecret,
      redirect_uris: [
        `${config.public.auth.baseUrl}/api/auth/login/${provider}/callback`,
      ],
      response_types: ["code"],
      // id_token_signed_response_alg (default "RS256")
      // token_endpoint_auth_method (default "client_secret_basic")
    }); // => Client

    const code_verifier = generators.codeVerifier();
    // store the code_verifier in your framework's session mechanism, if it is a cookie based solution
    // it should be httpOnly (not readable by javascript) and encrypted.

    setCookie(event, "code_verifier", code_verifier, {
      httpOnly: true,
    });

    const code_challenge = generators.codeChallenge(code_verifier);

    const authorizationUrl = client.authorizationUrl({
      scope: config.auth.providerScope,
      // resource: "https://my.api.example.com/resource/32178",
      code_challenge,
      code_challenge_method: "S256",
    });

    await sendRedirect(event, authorizationUrl);

    //return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
