import { defineEventHandler, readBody } from "h3";
import {
  sendMail,
  createEmailVerifyToken,
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
      const emailVerifyToken = createEmailVerifyToken({
        userId: user.id,
      });

      const redirectUrl = publicConfig.baseUrl + "/api/auth/email/verify";
      const link = redirectUrl + "?token=" + emailVerifyToken;

      await sendMail({
        to: user.email,
        subject: "Email verification",
        html: Mustache.render(
          privateConfig.emailTemplates?.emailVerify || emailVerifyTemplate,
          {
            ...user,
            link,
          }
        ),
      });
    }

    return {};
  } catch (error) {
    await handleError(error);
  }
});

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
    <b>Important, this link will expire in 5 minutes.</b>
    <p>Thank you, and have a good day.</p>
  </body>
</html>
`;
