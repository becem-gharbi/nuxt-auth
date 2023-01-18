import { defineEventHandler, createError, readBody } from "h3";
import { sendMail } from "#auth";
import { createEmailVerifyToken } from "#auth";
import { findUser } from "#auth";
import { publicConfig } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    const user = await findUser({ email: email });

    if (user && !user.verified) {
      const emailVerifyToken = createEmailVerifyToken({
        userId: user.id,
      });

      const redirectUrl = publicConfig.baseUrl + "/api/auth/email/verify";
      const fullRedirectUrl = redirectUrl + "?token=" + emailVerifyToken;

      await sendMail({
        to: user.email,
        subject: "Email verification",
        html: `
            <h2>Hello ${user.name}</h2>
            <br>
            <a href="${fullRedirectUrl}"style="background-color:#206bc4;color:white;padding:10px;border-radius:5px;margin:20px;text-decoration: none;">Verify My Email</a>
            `,
      });
    }

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
