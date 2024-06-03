import { defineEventHandler, sendRedirect, getValidatedQuery, getValidatedRouterParams } from 'h3'
import { resolveURL, withQuery } from 'ufo'
import { z } from 'zod'
import { getConfig, handleError, createCustomError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  const providers = config.private.oauth ? Object.keys(config.private.oauth) : []

  // TODO: endpoint should not exist in the first place
  if (!providers.length) {
    throw createCustomError(500, 'Something went wrong')
  }

  const pSchema = z.object({
    provider: z.custom<string>(value => providers.includes(value)),
  })

  const { provider } = await getValidatedRouterParams(event, pSchema.parse)

  const qSchema = z.object({
    redirect: z.string().startsWith('/').optional(),
  })

  // The protected page the user has visited before redirect to login page
  const { redirect: returnToPath } = await getValidatedQuery(event, qSchema.parse)

  try {
    const oauthProvider = config.private.oauth![provider]

    const redirectUri = resolveURL(config.public.baseUrl, '/api/auth/login', provider, 'callback')

    const authorizationUrl = withQuery(
      oauthProvider.authorizeUrl,
      {
        response_type: 'code',
        scope: oauthProvider.scopes,
        redirect_uri: redirectUri,
        client_id: oauthProvider.clientId,
        state: returnToPath,
      },
    )

    await sendRedirect(event, authorizationUrl)
  }
  catch (error) {
    await handleError(error)
  }
})
