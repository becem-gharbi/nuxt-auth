import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { createUser, findUser } from "#auth";
import { createRefreshToken, setRefreshTokenCookie } from "#auth";
import { privateConfig, publicConfig } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const provider = event.context.params.provider;
    const code = getQuery(event).code?.toString() || "";

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

    const tokenResponse = await fetch(privateConfig.oauth[provider].tokenUrl, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch(privateConfig.oauth[provider].userUrl, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    const userInfo = await userResponse.json();

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
          verified: true,
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
      `${publicConfig.baseUrl + publicConfig.redirect.callback}`
    );
  } catch (error) {
    await sendRedirect(
      event,
      `${
        publicConfig.baseUrl +
        publicConfig.redirect.callback +
        "?error=" +
        error.message
      }`
    );
  }
});
