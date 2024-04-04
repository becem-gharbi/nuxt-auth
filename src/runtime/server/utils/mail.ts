import type { NitroApp } from 'nitropack'
import type { MailMessage } from '../../types'
import { getConfig } from './config'
// @ts-ignore
// eslint-disable-next-line import/named
import { useNitroApp } from '#imports'

export async function sendMail (msg: MailMessage) {
  const config = getConfig()

  if (!config.private.email?.provider) {
    throw new Error('Please make sure to configure email provider')
  }

  const settings = config.private.email

  switch (settings.provider.name) {
    case 'hook':
      return await withHook()
    case 'custom':
      return await withCustom(settings.provider.url, settings.provider.authorization)
    case 'sendgrid':
      return await withSendgrid(settings.provider.apiKey)
    case 'resend':
      return await withResend(settings.provider.apiKey)
    default:
      throw new Error('invalid-email-provider')
  }

  function withSendgrid (apiKey: string) {
    return $fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`
      },
      body: {
        personalizations: [
          {
            to: [{ email: msg.to }],
            subject: msg.subject
          }
        ],
        content: [{ type: 'text/html', value: msg.html }],
        from: { email: settings.from },
        reply_to: { email: settings.from }
      }
    })
  }

  // https://resend.com/docs/api-reference/emails/send-email
  function withResend (apiKey: string) {
    return $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: {
        from: settings.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html
      }
    })
  }

  function withCustom (url: string, authorization: string) {
    return $fetch(url, {
      method: 'POST',
      headers: {
        authorization
      },
      body: {
        ...msg,
        from: settings.from
      }
    })
  }

  function withHook () {
    const nitroApp = useNitroApp() as NitroApp
    return nitroApp.hooks.callHook('auth:email', settings.from, msg)
  }
}
