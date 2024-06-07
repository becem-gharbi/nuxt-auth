import { defineEventHandler, getValidatedRouterParams } from 'h3'
import { z } from 'zod'
import { handleError, createUnauthorizedError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const schema = z.object({
      id: z.string().min(1),
    })

    const params = await getValidatedRouterParams(event, schema.parse)

    // @ts-expect-error id can either be string or number
    params.id = Number.isNaN(Number(params.id)) ? params.id : Number(params.id)

    const refreshTokenEntity = await event.context.auth.adapter.refreshToken.findById(params.id, authData.userId)

    if (refreshTokenEntity?.userId !== authData.userId) {
      throw createUnauthorizedError()
    }

    await event.context.auth.adapter.refreshToken.delete(params.id, authData.userId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
