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

    // TODO: check in case id is a number
    const { id } = await getValidatedRouterParams(event, schema.parse)

    const refreshTokenEntity = await event.context._authAdapter.refreshToken.findById(id)

    if (!refreshTokenEntity || refreshTokenEntity.userId !== auth.userId) {
      throw createUnauthorizedError()
    }

    await event.context._authAdapter.refreshToken.delete(id)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
