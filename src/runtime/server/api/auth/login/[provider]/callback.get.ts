import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { z } from "zod";
import { $fetch } from "ofetch";
import {
  createRefreshToken,
  setRefreshTokenCookie,
  createUser,
  findUser,
  handleError,
  signRefreshToken,
  getConfig,
} from "#auth";
import { resolveURL, withQuery } from "ufo";
import { User } from "../../../../../types";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  try {
    if (!config.public.redirect.callback) {
      throw new Error("Please make sure to set callback redirect path");
    }

    const provider = event.context.params!.provider;

    const { state: returnToPath, code } = getQuery(event) as {
      state?: string;
      code: string;
    };

    const schema = z.object({
      code: z.string(),
    });

    schema.parse({ code });

    if (!config.private.oauth || !config.private.oauth[provider]) {
      throw new Error("oauth-not-configured");
    }

    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", config.private.oauth[provider].clientId);
    formData.append(
      "client_secret",
      config.private.oauth[provider].clientSecret
    );
    formData.append(
      "redirect_uri",
      resolveURL(config.public.baseUrl, "/api/auth/login", provider, "callback")
    );

    const { access_token } = await $fetch(
      config.private.oauth[provider].tokenUrl,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const userInfo = await $fetch(config.private.oauth[provider].userUrl, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    if (!userInfo.name) {
      throw new Error("name-not-accessible");
    }

    if (!userInfo.email) {
      throw new Error("email-not-accessible");
    }

    let user: User | undefined = undefined;

    user = await findUser(event, { email: userInfo.email });

    if (!user) {
      if (config.private.registration?.enable === false) {
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

      const newUser = await createUser(event, {
        email: userInfo.email,
        name: userInfo.name,
        provider: provider,
        picture,
        verified: true,
      });

      user = Object.assign(newUser);
    }

    if (user) {
      if (user.provider !== provider) {
        throw new Error(`email-used-with-${user.provider}`);
      }

      if (user.suspended) {
        throw new Error("account-suspended");
      }

      const payload = await createRefreshToken(event, user);

      setRefreshTokenCookie(event, signRefreshToken(payload));
    }

    await sendRedirect(
      event,
      withQuery(config.public.redirect.callback, { redirect: returnToPath })
    );
  } catch (error) {
    await handleError(error, {
      event,
      url: config.public.redirect.callback,
    });
  }
});
