import { defineEventHandler, getValidatedQuery, setResponseHeaders } from 'h3'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    name: z.string().min(1),
    color: z.string().regex(/^([a-f0-9]{6}|[a-f0-9]{3})$/).optional(),
    background: z.string().regex(/^([a-f0-9]{6}|[a-f0-9]{3})$/).optional(),
  })

  const query = await getValidatedQuery(event, schema.parse)

  query.background ||= 'f0e9e9'
  query.color ||= '8b5d5d'

  setResponseHeaders(event, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=2592000, immutable',
  })

  // TODO: create utility function
  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 64 64" version="1.1">
        <rect fill="#${query.background}" cx="32" width="64" height="64" cy="32" r="32"/>
        <text x="50%" y="50%" style="color: #${query.color}; line-height: 1;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;" alignment-baseline="middle" text-anchor="middle" font-size="32" font-weight="600" dy=".1em" dominant-baseline="middle" fill="#${query.color}">
            ${query.name[0].toUpperCase()}
        </text>
    </svg>
    `
})
