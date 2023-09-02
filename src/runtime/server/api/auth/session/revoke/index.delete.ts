import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import {
  handleError,
  getAccessTokenFromHeader,
  verifyAccessToken,
  findRefreshTokenById,
  deleteRefreshToken
} from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event)

    const schema = z.object({
      id: z.number().or(z.string())
    })

    schema.parse({ id })

    const accessToken = getAccessTokenFromHeader(event)

    if (!accessToken) {
      throw new Error('unauthorized')
    }

    const payload = await verifyAccessToken(accessToken)

    const refreshTokenEntity = await findRefreshTokenById(event, id)

    if (!refreshTokenEntity || refreshTokenEntity.userId !== payload.userId) {
      throw new Error('unauthorized')
    }

    await deleteRefreshToken(event, id)

    return 'ok'
  } catch (error) {
    await handleError(error)
  }
})
