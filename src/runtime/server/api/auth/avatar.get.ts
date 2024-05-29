import { defineEventHandler, getQuery, setResponseHeaders, createError } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery<{
    name: string
    color: string
    background: string
  }>(event)

  query.name ||= ''
  query.background ||= 'f0e9e9'
  query.color ||= '8b5d5d'

  const validateColor = (color: string) => {
    const valid = /^([A-F0-9]{6}|[A-F0-9]{3})$/i.test(color)
    if (!valid) {
      throw createError({
        statusCode: 422,
        message: 'Color should be in format rrggbb or rgb',
      })
    }
  }

  validateColor(query.color)
  validateColor(query.background)

  setResponseHeaders(event, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=2592000, immutable',
  })

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 64 64" version="1.1">
        <rect fill="#${query.background}" cx="32" width="64" height="64" cy="32" r="32"/>
        <text x="50%" y="50%" style="color: #${query.color}; line-height: 1;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;" alignment-baseline="middle" text-anchor="middle" font-size="32" font-weight="600" dy=".1em" dominant-baseline="middle" fill="#${query.color}">
            ${query.name[0].toUpperCase()}
        </text>
    </svg>
    `
})
