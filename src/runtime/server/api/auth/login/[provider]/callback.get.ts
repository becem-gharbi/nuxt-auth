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
  signRefreshToken,
} from "#auth";
import { resolveURL } from "ufo";
import { User } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    if (!publicConfig.redirect.callback) {
      throw new Error("Please make sure to set callback redirect path");
    }

    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString();

    const schema = z.object({
      code: z.string(),
    });

    schema.parse({ code });

    if (!privateConfig.oauth || !privateConfig.oauth[provider]) {
      throw new Error("oauth-not-configured");
    }

    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code!);
    formData.append("client_id", privateConfig.oauth[provider].clientId);
    formData.append(
      "client_secret",
      privateConfig.oauth[provider].clientSecret
    );
    formData.append(
      "redirect_uri",
      resolveURL(publicConfig.baseUrl, "/api/auth/login", provider, "callback")
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
        throw new Error(`email-used-with-${user.provider}`);
      }

      if (!user) {
        if (privateConfig.registration?.enable === false) {
          throw new Error("registration-disabled");
        }

        const picture_key = Object.keys(userInfo).find((el) =>
          [
            "avatar",
            "avatar_url",
            "picture",
            "picture_url",
            "photo",
            "photo_url",
          ].includes(el)
        );

        const picture = picture_key ? userInfo[picture_key] : null;

        const newUser = await createUser({
          email: userInfo.email,
          name: userInfo.name,
          provider: provider,
          picture,
          verified: true,
        });

        user = Object.assign(newUser);
      }

      if (user) {
        const payload = await createRefreshToken(event, user);

        setRefreshTokenCookie(event, signRefreshToken(payload));

        const sessionId = payload.id;

        const accessToken = createAccessToken(user, sessionId);

        setAccessTokenCookie(event, accessToken);
      }
    } else {
      throw new Error("email-not-accessible");
    }

    await sendRedirect(event, publicConfig.redirect.home);
  } catch (error) {
    await handleError(error, {
      event,
      url: publicConfig.redirect.callback,
    });
  }
});
