import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { handleError, findRefreshTokenById, deleteRefreshToken } from '../../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id as string

    const schema = z.object({
      id: z.number().or(z.string())
    })

    schema.parse({ id })

    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    const refreshTokenEntity = await findRefreshTokenById(event, id)

    if (!refreshTokenEntity || refreshTokenEntity.userId !== auth.userId) {
      throw new Error('unauthorized')
    }

    await deleteRefreshToken(event, id)

    return { status: 'ok' }
  } catch (error) {
    await handleError(error)
  }
})
