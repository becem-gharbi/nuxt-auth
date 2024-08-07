import { defineEventHandler, getValidatedQuery, sendRedirect, getValidatedRouterParams } from 'h3'
import { z } from 'zod'
import { $fetch } from 'ofetch'
import { resolveURL, withQuery } from 'ufo'
import { getConfig, createRefreshToken, setRefreshTokenCookie, handleError, signRefreshToken, createCustomError, createAccount } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const providers = config.private.oauth ? Object.keys(config.private.oauth) : []

    const pSchema = z.object({
      provider: z.custom<string>(value => providers.includes(value)),
    })

    const { provider } = await getValidatedRouterParams(event, pSchema.parse)

    const oauthProvider = config.private.oauth![provider]!

    const qSchema = z.object({
      code: z.string().min(1),
      state: z.string().startsWith('/').optional(),
    })

    const { state: returnToPath, code } = await getValidatedQuery(event, qSchema.parse)

    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('code', code)
    formData.append('client_id', oauthProvider.clientId)
    formData.append('client_secret', oauthProvider.clientSecret)
    formData.append('redirect_uri', resolveURL(config.public.baseUrl, '/api/auth/login', provider, 'callback'))

    const { access_token: accessToken } = await $fetch(
      oauthProvider.tokenUrl,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const userInfo = await $fetch(oauthProvider.userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userInfo.name) {
      throw createCustomError(400, 'Oauth name not accessible')
    }

    if (!userInfo.email) {
      throw createCustomError(400, 'Oauth email not accessible')
    }

    const user = await event.context.auth.adapter.user.findByEmail(userInfo.email)

    let userId = user?.id

    if (user) {
      if (user.provider !== provider) {
        throw createCustomError(403, 'Email already used')
      }

      if (user.suspended) {
        throw createCustomError(403, 'Account suspended')
      }
    }
    else {
      const pictureKey = Object.keys(userInfo).find(el =>
        [
          'avatar',
          'avatar_url',
          'picture',
          'picture_url',
          'photo',
          'photo_url',
        ].includes(el),
      )

      const picture = pictureKey ? userInfo[pictureKey] : null

      const newUser = await createAccount(event, {
        provider,
        verified: true,
        email: userInfo.email,
        name: userInfo.name,
        picture,
      })

      userId = newUser.id
    }

    const payload = await createRefreshToken(event, userId!)

    const refreshToken = await signRefreshToken(payload)

    setRefreshTokenCookie(event, refreshToken)

    const redirectUrl = withQuery(config.public.redirect.callback!, { redirect: returnToPath })

    await sendRedirect(event, redirectUrl)
  }
  catch (error) {
    await handleError(error, { event, url: config.public.redirect.callback! })
  }
})
