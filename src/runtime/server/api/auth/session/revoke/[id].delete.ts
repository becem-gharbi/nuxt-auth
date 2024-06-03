import { defineEventHandler, getValidatedRouterParams } from 'h3'
import { z } from 'zod'
import { handleError, createUnauthorizedError } from '../../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw createUnauthorizedError()
    }

    const schema = z.object({
      id: z.string().min(1).or(z.number()),
    })

    const params = await getValidatedRouterParams(event, schema.parse)

    params.id = Number.isNaN(Number(params.id)) ? params.id : Number(params.id)

    const refreshTokenEntity = await event.context._authAdapter.refreshToken.findById(params.id)

    if (!refreshTokenEntity || refreshTokenEntity.userId !== auth.userId) {
      throw createUnauthorizedError()
    }

    await event.context._authAdapter.refreshToken.delete(params.id)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
