import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { z } from 'zod'
import { $fetch } from 'ofetch'
import { resolveURL, withQuery } from 'ufo'
import type { User, Provider } from '../../../../../types'
import { getConfig, createRefreshToken, setRefreshTokenCookie, createUser, findUser, handleError, signRefreshToken } from '../../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.callback) {
      throw new Error('Please make sure to set callback redirect path')
    }

    const provider = event.context.params!.provider as Provider

    const { state: returnToPath, code } = getQuery<{ code: string, state: string }>(event)

    const schema = z.object({
      code: z.string(),
    })

    schema.parse({ code })

    const oauthProvider = config.private.oauth?.[provider]

    if (!oauthProvider) {
      throw new Error('oauth-not-configured')
    }

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

    let user: User | null = null

    user = await findUser(event, { email: userInfo.email })

    if (!user) {
      if (config.private.registration.enable === false) {
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

      const newUser = await createUser(event, {
        email: userInfo.email,
        name: userInfo.name,
        provider,
        picture,
        verified: true,
      })

      user = Object.assign(newUser)
    }

    if (user) {
      if (user.provider !== provider) {
        throw new Error(`email-used-with-${user.provider}`)
      }

      if (user.suspended) {
        throw new Error('account-suspended')
      }

      const payload = await createRefreshToken(event, user)

      const refreshToken = await signRefreshToken(payload)

      setRefreshTokenCookie(event, refreshToken)
    }

    await sendRedirect(
      event,
      withQuery(config.public.redirect.callback, { redirect: returnToPath }),
    )
  }
  catch (error) {
    await handleError(error, {
      event,
      url: config.public.redirect.callback!,
    })
  }
})
