import { withQuery } from 'ufo'

export function generateAvatar(name: string) {
  // https://tailwindcss.com/docs/customizing-colors#default-color-palette
  // Variant 700
  const colors = [
    'b91c1c' /* red */,
    'c2410c' /* orange */,
    'b45309' /* amber */,
    'a16207' /* yellow */,
    '4d7c0f' /* lime */,
    '15803d' /* green */,
    '0f766e' /* teal */,
    '0e7490' /* cyan */,
    '1d4ed8' /* blue */,
    '4338ca' /* indigo */,
    '6d28d9' /* violet */,
    'be123c', /* rose */
  ]

  const randomIndex = Math.floor(Math.random() * (colors.length - 1))

  const url = withQuery('/api/auth/avatar', {
    name,
    color: 'f5f5f5',
    background: colors[randomIndex],
  })

  return url
}
