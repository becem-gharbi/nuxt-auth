import { getConfig } from "./config";
import type { H3Event } from "h3";
import type { MailMessage } from "../../types";

export async function sendMail(event: H3Event, msg: MailMessage) {
  const config = getConfig(event);

  if (!config.private.email) {
    throw new Error("Please make sure to configure email option");
  }

  const settings = config.private.email;

  switch (settings.provider.name) {
    case "custom":
      return withCustom(settings.provider.url, settings.provider.authorization);
    case "sendgrid":
      return withSendgrid(settings.provider.apiKey);
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
