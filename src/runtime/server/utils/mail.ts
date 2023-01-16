//@ts-ignore
import { useRuntimeConfig } from "#imports";
import nodemailer from "nodemailer";

type Message = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function sendMail(msg: Message) {
  const config = useRuntimeConfig();

  let transporter = nodemailer.createTransport({
    host: config.auth.smtpHost,
    port: config.auth.smtpPort,
    auth: {
      user: config.auth.smtpUser,
      pass: config.auth.smtpPass,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: config.auth.smtpFrom,
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
