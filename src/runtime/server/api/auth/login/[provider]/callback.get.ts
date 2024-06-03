import { defineEventHandler, getValidatedQuery, sendRedirect, getValidatedRouterParams } from 'h3'
import { z } from 'zod'
import { $fetch } from 'ofetch'
import { resolveURL, withQuery } from 'ufo'
import { getConfig, createRefreshToken, setRefreshTokenCookie, generateAvatar, handleError, signRefreshToken } from '../../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.callback) {
      throw new Error('Please make sure to set callback redirect path')
    }

    const providers = config.private.oauth ? Object.keys(config.private.oauth) : []

    if (!providers.length) {
      throw new Error('oauth-not-configured')
    }

    const pSchema = z.object({
      provider: z.custom<string>(value => providers.includes(value)),
    })

    const { provider } = await getValidatedRouterParams(event, pSchema.parse)

    const oauthProvider = config.private.oauth![provider]

    const qSchema = z.object({
      code: z.string(),
      state: z.string().startsWith('/').optional(),
    })

    const { state: returnToPath, code } = await getValidatedQuery(event, qSchema.parse)

    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('code', code)
    formData.append('client_id', oauthProvider.clientId)
    formData.append(
      'client_secret',
      oauthProvider.clientSecret,
    )
    formData.append(
      'redirect_uri',
      resolveURL(config.public.baseUrl, '/api/auth/login', provider, 'callback'),
    )

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
        Authorization: 'Bearer ' + accessToken,
      },
    })

    if (!userInfo.name) {
      throw new Error('name-not-accessible')
    }

    if (!userInfo.email) {
      throw new Error('email-not-accessible')
    }

    const user = await event.context._authAdapter.user.findByEmail(userInfo.email)

    let userId = user?.id

    if (user) {
      if (user.provider !== provider) {
        throw new Error(`email-used-with-${user.provider}`)
      }

      if (user.suspended) {
        throw new Error('account-suspended')
      }
    }
    else {
      if (config.private.registration.enabled === false) {
        throw new Error('registration-disabled')
      }

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

      const newUser = await event.context._authAdapter.user.create({
        provider,
        password: null,
        verified: true,
        email: userInfo.email,
        name: userInfo.name,
        role: config.private.registration.defaultRole,
        picture: picture ?? generateAvatar(userInfo.name),
      })

      userId = newUser.id
    }

    const payload = await createRefreshToken(event, userId!)

    const refreshToken = await signRefreshToken(payload)

    setRefreshTokenCookie(event, refreshToken)

    await sendRedirect(event, withQuery(config.public.redirect.callback, { redirect: returnToPath }))
  }
  catch (error) {
    await handleError(error, {
      event,
      url: config.public.redirect.callback!,
    })
  }
})
