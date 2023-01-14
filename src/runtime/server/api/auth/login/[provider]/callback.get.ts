import {
  defineEventHandler,
  setCookie,
  createError,
  getCookie,
  getQuery,
  sendRedirect,
} from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { Issuer } from "openid-client";
import prisma from "../../../../utils/prisma";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString();

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

    const code_verifier = getCookie(event, "code_verifier");

    const tokenSet = await client.callback(
      `${config.public.auth.baseUrl}/api/auth/login/${provider}/callback`,
      {
        code,
      },
      {
        code_verifier,
      }
    );

    if (tokenSet.access_token) {
      const userInfo = await client.userinfo(tokenSet.access_token);

      let user = await prisma.user.findUnique({
        where: {
          email: userInfo.email,
        },
      });

      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            photoUrl: userInfo.picture,
          },
        });

        user = Object.assign(newUser);
      }

      if (user) {
        const newRefreshToken = jwt.sign(
          { userId: user.id },
          config.auth.refreshTokenSecret
        );

        setCookie(
          event,
          config.public.auth.refreshTokenCookieName,
          newRefreshToken,
          {
            httpOnly: true,
            secure: true,
            maxAge: config.auth.refreshTokenMaxAge,
            sameSite: "lax",
          }
        );
      }
    }

    await sendRedirect(
      event,
      `${config.public.auth.baseUrl + config.public.auth.redirect.callback}`
    );
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
