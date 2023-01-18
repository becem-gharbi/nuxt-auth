import nodemailer from "nodemailer";
import type { MailMessage } from "../../types";
import { privateConfig } from "./config";

export function sendMail(msg: MailMessage) {
  let transporter = nodemailer.createTransport({
    host: privateConfig.smtp.host,
    port: privateConfig.smtp.port,
    auth: {
      user: privateConfig.smtp.user,
      pass: privateConfig.smtp.pass,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: privateConfig.smtp.from,
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
