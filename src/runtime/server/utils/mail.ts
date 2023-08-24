import { createTransport } from "nodemailer";
import { getConfig } from "#auth";
import type { H3Event } from "h3";
import type { MailMessage } from "../../types";

export function sendMail(event: H3Event, msg: MailMessage) {
  const config = getConfig(event);

  if (!config.private.smtp) {
    throw new Error("Please make sure to configure smtp option");
  }

  let transporter = createTransport({
    host: config.private.smtp.host,
    port: config.private.smtp.port,
    auth: {
      user: config.private.smtp.user,
      pass: config.private.smtp.pass,
    },
  });

  return new Promise((resolve, reject) => {
    if (!config.private.smtp) {
      throw new Error("Please make sure to configure smtp option");
    }

    transporter.sendMail(
      {
        from: config.private.smtp.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      },
      (err, info) => {
        if (err) {
          reject(err);
        }
        resolve(info);
      }
    );
  });
}
