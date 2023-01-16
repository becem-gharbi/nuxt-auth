//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { defineEventHandler, createError, getQuery, sendRedirect } from "h3";
import { ofetch } from "ofetch";
import { createUser, findUser } from "../../../../utils/user";
import {
  createRefreshToken,
  setRefreshTokenCookie,
} from "../../../../utils/token";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString() || "";

    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", config.auth.oauth[provider].clientId);
    formData.append("client_secret", config.auth.oauth[provider].clientSecret);
    formData.append(
      "redirect_uri",
      `${config.public.auth.baseUrl}/api/auth/login/${provider}/callback`
    );

    const { access_token } = await ofetch(
      config.auth.oauth[provider].getTokenUrl,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const userInfo = await ofetch<{
      email: string;
      name: string;
    }>(config.auth.oauth[provider].getUserUrl, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    if (userInfo.email) {
      let user = await findUser({ email: userInfo.email });

      if (user && user.provider !== provider) {
        throw new Error("wrong-provider");
      }

      if (!user) {
        user = await createUser({
          email: userInfo.email,
          name: userInfo.name,
          provider: provider,
        });
      }

      if (user) {
        const refreshToken = await createRefreshToken(user.id);

        setRefreshTokenCookie(event, {
          id: refreshToken.id,
          uid: refreshToken.uid,
          userId: refreshToken.userId,
        });
      }
    }

    await sendRedirect(
      event,
      `${config.public.auth.baseUrl + config.public.auth.redirect.callback}`
    );
  } catch (error) {
    await sendRedirect(
      event,
      `${
        config.public.auth.baseUrl +
        config.public.auth.redirect.callback +
        "?error=" +
        error.message
      }`
    );
  }
});
