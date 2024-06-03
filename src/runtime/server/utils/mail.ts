import type { MailMessage } from '../../types'
import { getConfig } from './config'
import { createCustomError } from './error'

// @ts-expect-error importing an internal module
import { useNitroApp } from '#imports'

export async function sendMail(msg: MailMessage) {
  const config = getConfig()

  // TODO: should not be called in the first place
  if (!config.private.email?.provider) {
    throw createCustomError(500, 'Something went wrong')
  }

  const settings = config.private.email

  switch (settings.provider.name) {
    case 'hook':
      return await withHook()
    case 'sendgrid':
      return await withSendgrid(settings.provider.apiKey)
    case 'resend':
      return await withResend(settings.provider.apiKey)
    default:
      // TODO: should not be called in the first place
      throw createCustomError(500, 'Something went wrong')
  }

  function withSendgrid(apiKey: string) {
    return $fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
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
        content: [{ type: 'text/html', value: msg.html }],
        from: { email: settings.from },
        reply_to: { email: settings.from },
      },
    })
  }

  // https://resend.com/docs/api-reference/emails/send-email
  function withResend(apiKey: string) {
    return $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: {
        from: settings.from,
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
      },
    })
  }

  function withHook() {
    const nitroApp = useNitroApp()
    return nitroApp.hooks.callHook('auth:email', settings.from, msg)
  }
}
