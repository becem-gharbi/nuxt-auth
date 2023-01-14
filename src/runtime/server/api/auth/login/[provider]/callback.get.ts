import {
  defineEventHandler,
  setCookie,
  createError,
  getCookie,
  getQuery,
  sendRedirect,
} from "h3";
//@ts-ignore
import { useRuntimeConfig, useFetch } from "#imports";
import prisma from "../../../../utils/prisma";
import jwt from "jsonwebtoken";
import { ofetch } from "ofetch";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString() || "";

    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", config.auth.oauthClientId);
    formData.append("client_secret", config.auth.oauthClientSecret);
    formData.append(
      "redirect_uri",
      `${config.public.auth.baseUrl}/api/auth/login/google/callback`
    );

    const { access_token } = await ofetch(config.auth.oauthGetTokenUrl, {
      method: "POST",
      body: formData,
    });

    const userInfo = await ofetch<{
      email: string;
      name: string;
      picture: string;
    }>(config.auth.oauthGetUserUrl, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    if (userInfo.email) {
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
