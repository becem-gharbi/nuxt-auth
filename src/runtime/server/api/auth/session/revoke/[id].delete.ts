import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { handleError, findRefreshTokenById, deleteRefreshToken } from '../../../../utils'
import type { RefreshToken } from '../../../../../types'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params!.id) || event.context.params!.id

    const schema = z.object({
      id: z.number().or(z.string()),
    })

    schema.parse({ id })

    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    const refreshTokenEntity = await findRefreshTokenById(event, id as RefreshToken['id'])

    if (!refreshTokenEntity || refreshTokenEntity.userId !== auth.userId) {
      throw new Error('unauthorized')
    }

    await deleteRefreshToken(event, id as RefreshToken['id'])

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
