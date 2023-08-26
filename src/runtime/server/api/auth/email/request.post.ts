import { defineEventHandler, readBody } from "h3";
import {
  getConfig,
  sendMail,
  createEmailVerifyToken,
  findUser,
  handleError,
} from "#auth";
import mustache from "mustache";
import { resolveURL, withQuery } from "ufo";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  const emailVerifyTemplate = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
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
        margin: 8px;
      }
    </style>
  </head>

  <body>
    <h2>Hello {{name}},</h2>
    <p>
      We have received a request to verify your email address. If you haven't
      made this request please ignore the following email.
    </p>
    <p>
      Otherwise, to complete the process, click the following link.
    </p>
    <a href="{{link}}">Verify your email</a>
    <b>Important, this link will expire in {{validityInMinutes}} minutes.</b>
    <p>Thank you, and have a good day.</p>
  </body>
  </html>
`;

  try {
    if (!config.public.redirect.emailVerify) {
      throw new Error("Please make sure to set emailVerify redirect path");
    }

    const { email } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
    });

    schema.parse({ email });

    const user = await findUser(event, { email: email });

    if (user && !user.verified) {
      const emailVerifyToken = await createEmailVerifyToken(event, {
        userId: user.id,
      });

      const redirectUrl = resolveURL(
        config.public.baseUrl,
        "/api/auth/email/verify"
      );

      const link = withQuery(redirectUrl, { token: emailVerifyToken });

      await sendMail(event, {
        to: user.email,
        subject: "Email verification",
        html: mustache.render(
          config.private.emailTemplates?.emailVerify || emailVerifyTemplate,
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
