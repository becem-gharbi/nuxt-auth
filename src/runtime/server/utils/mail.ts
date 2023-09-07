import type { MailMessage } from "../../types";
import { getConfig } from "./config";

export async function sendMail(msg: MailMessage) {
  const config = getConfig();

  if (!config.private.email) {
    throw new Error("Please make sure to configure email option");
  }

  const settings = config.private.email;

  switch (settings.provider.name) {
    case "custom":
      return await withCustom(
        settings.provider.url,
        settings.provider.authorization
      );
    case "sendgrid":
      return await withSendgrid(settings.provider.apiKey);
    case "resend":
      return await withResend(settings.provider.apiKey);
    default:
      throw new Error("invalid-email-provider");
  }

  function withSendgrid(apiKey: string) {
    return $fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
      body: {
        personalizations: [
          {
            to: [{ email: msg.to }],
            subject: msg.subject,
          },
        ],
        content: [{ type: "text/html", value: msg.html }],
        from: { email: settings.from },
        reply_to: { email: settings.from },
      },
    });
  }

  // https://resend.com/docs/api-reference/emails/send-email
  function withResend(apiKey: string) {
    return $fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: {
        from: settings.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
      },
    });
  }

  function withCustom(url: string, authorization: string) {
    return $fetch(url, {
      method: "POST",
      headers: {
        authorization,
      },
      body: {
        ...msg,
        from: settings.from,
      },
    });
  }
}
