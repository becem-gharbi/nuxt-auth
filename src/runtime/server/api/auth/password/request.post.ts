import { defineEventHandler, readBody } from "h3";
import {
  getConfig,
  sendMail,
  createResetPasswordToken,
  findUser,
  handleError,
} from "#auth";
import mustache from "mustache";
import { resolveURL, withQuery } from "ufo";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  const passwordResetTemplate = `
  <html lang="en">
  <head>
    <style>
      body {
        background-color: #f1f5f9;
        color: #0f172a;
        font-family: "Arial";
        padding: 8px;
      }

      a {
        cursor: pointer;
        display: block;
        text-align: center;
        color: #4338ca;
        margin: 24px;
      }
    </style>
  </head>

  <body>
    <h2>Hello {{name}},</h2>
    <p>
      We have received a request to reset your password. If you haven't
      made this request please ignore the following email.
    </p>
    <p>
      Otherwise, to complete the process, click the following link.
    </p>
    <a href="{{link}}">Reset your password</a>
    <b>Important, this link will expire in {{validityInMinutes}} minutes.</b>
    <p>Thank you, and have a good day.</p>
  </body>
  </html>
`;

  try {
    if (!config.public.redirect.passwordReset) {
      throw new Error("Please make sure to set passwordReset redirect path");
    }

    const { email } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
    });

    schema.parse({ email });

    const user = await findUser(event, { email: email });

    if (user && user.provider === "default") {
      const resetPasswordToken = await createResetPasswordToken(event, {
        userId: user.id,
      });

      const redirectUrl = resolveURL(
        config.public.baseUrl,
        config.public.redirect.passwordReset
      );
      const link = withQuery(redirectUrl, { token: resetPasswordToken });

      await sendMail(event, {
        to: user.email,
        subject: "Password Reset",
        html: mustache.render(
          config.private.email.templates?.passwordReset ||
            passwordResetTemplate,
          {
            ...user,
            link,
            validityInMinutes: Math.round(
              config.private.accessToken.maxAge / 60
            ),
          }
        ),
      });
    }

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
