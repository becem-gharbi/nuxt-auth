import { defineEventHandler, sendRedirect, getQuery } from 'h3'
import { resolveURL, withQuery } from 'ufo'
import { getConfig, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()
  const provider = event.context.params!.provider

  const oauthProvider = config.private.oauth?.[provider]

  if (!oauthProvider) {
    throw new Error('oauth-not-configured')
  }

  // The protected page the user has visited before redirect to login page
  const returnToPath = getQuery(event)?.redirect

  try {
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
