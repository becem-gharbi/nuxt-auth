import { defineEventHandler, readBody } from "h3";

import {
  sendMail,
  createResetPasswordToken,
  findUser,
  publicConfig,
  privateConfig,
  handleError,
} from "#auth";

import Mustache from "mustache";

import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
    });

    schema.parse({ email });

    const user = await findUser({ email: email });

    if (user) {
      const resetPasswordToken = createResetPasswordToken({
        userId: user.id,
      });

      const redirectUrl =
        publicConfig.baseUrl + publicConfig.redirect.passwordReset;
      const link = redirectUrl + "?token=" + resetPasswordToken;

      await sendMail({
        to: user.email,
        subject: "Password Reset",
        html: Mustache.render(
          privateConfig.emailTemplates?.passwordReset || passwordResetTemplate,
          {
            ...user,
            link,
            validityInMinutes: Math.round(
              privateConfig.accessToken.maxAge / 60
            ),
          }
        ),
      });
    }

    return {};
  } catch (error) {
    await handleError(error);
  }
});

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
