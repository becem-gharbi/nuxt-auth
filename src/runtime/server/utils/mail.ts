import nodemailer from "nodemailer";
import type { MailMessage } from "../../types";
import { privateConfig } from "./config";

export function sendMail(msg: MailMessage) {
  let transporter = nodemailer.createTransport({
    host: privateConfig.smtpHost,
    port: privateConfig.smtpPort,
    auth: {
      user: privateConfig.smtpUser,
      pass: privateConfig.smtpPass,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: privateConfig.smtpFrom,
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
