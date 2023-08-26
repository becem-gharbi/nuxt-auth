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

const passwordResetTemplate = `
        <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:Inter;font-style:normal;font-weight:400;mso-font-alt:Verdana;src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:Inter,Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td><img alt="" src="https://nuxt.com/assets/design-kit/logo/icon-green.png" style="display: block;outline: none;border: none;text-decoration: none;margin-bottom: 32px;margin-top: 0px;height: 48px;"><h3 style="font-size: 24px;font-weight: 600;line-height: 38px;margin-bottom: 12px;color: rgb(17, 24, 39);text-align: left;">Hello {{name}}</h3><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We have received a request to reset your password. If you haven't made this request please ignore the following email. Otherwise, to complete the process, click the following link.</p><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:20px;text-align:left;"><tbody><tr><td><a href="{{link}}" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #ffffff;background-color: #0daa24;border-color: #0daa24;padding: 12px 34px;border-radius: 6px;">
        <span></span>
        <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">
        Reset password</span>
        <span></span>
        </a></td></tr></tbody></table><hr style="width: 100%;border: none;border-top: 1px solid #eaeaea;margin-top: 32px;margin-bottom: 32px;"><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;"><strong>This link will expire in {{validityInMinutes}} minutes.</strong></p></td></tr></tbody></table></body></html>
`;

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

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
