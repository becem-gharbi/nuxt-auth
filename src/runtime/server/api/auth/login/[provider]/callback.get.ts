import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { z } from "zod";
import { $fetch } from "ofetch";

import {
  createRefreshToken,
  setRefreshTokenCookie,
  privateConfig,
  createUser,
  findUser,
  publicConfig,
  createAccessToken,
  setAccessTokenCookie,
  handleError,
} from "#auth";

import { User } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString() || "";

    const schema = z.object({
      code: z.string().min(1),
    });

    schema.parse({ code });

    if (!privateConfig.oauth || !privateConfig.oauth[provider]) {
      throw new Error("oauth-not-configured");
    }

    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", privateConfig.oauth[provider].clientId);
    formData.append(
      "client_secret",
      privateConfig.oauth[provider].clientSecret
    );
    formData.append(
      "redirect_uri",
      `${publicConfig.baseUrl}/api/auth/login/${provider}/callback`
    );

    const { access_token } = await $fetch(
      privateConfig.oauth[provider].tokenUrl,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const userInfo = await $fetch(privateConfig.oauth[provider].userUrl, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    if (userInfo.email) {
      let user: User | undefined = undefined;

      user = await findUser({ email: userInfo.email });

      if (user && user.provider !== provider) {
        throw new Error("wrong-provider");
      }

      if (!user) {
        const newUser = await createUser({
          email: userInfo.email,
          name: userInfo.name,
          provider: provider,
          picture: userInfo.picture,
          verified: true,
        });

        user = Object.assign(newUser);
      }

      if (user) {
        const refreshToken = await createRefreshToken(user);

        setRefreshTokenCookie(event, refreshToken);

        const accessToken = createAccessToken(user);

        setAccessTokenCookie(event, accessToken);
      }
    }

    await sendRedirect(
      event,
      `${publicConfig.baseUrl + publicConfig.redirect.home}`
    );
  } catch (error) {
    await handleError(error, {
      event,
      url: `${publicConfig.baseUrl + publicConfig.redirect.callback}`,
    });
  }
});
