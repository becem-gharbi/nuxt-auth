import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { handleError } from '../../../../utils'

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

    const refreshTokenEntity = await event.context._authAdapter.refreshToken.findById(id)

    if (!refreshTokenEntity || refreshTokenEntity.userId !== auth.userId) {
      throw new Error('unauthorized')
    }

    await event.context._authAdapter.refreshToken.delete(id)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
