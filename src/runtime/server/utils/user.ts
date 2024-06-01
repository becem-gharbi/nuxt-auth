import { withQuery } from 'ufo'
import type { H3Event } from 'h3'
import type { Prisma } from '@prisma/client'
import type { User } from '../../types'
import { getConfig } from './config'
import { hashSync, compareSync } from './bcrypt'

export async function findUserById(
  event: H3Event,
  id: User['id'],
) {
  const prisma = event.context.prisma

  const user = await prisma.user.findUnique({
    where: { id },
  })
  return user
}

export async function findUserByEmail(
  event: H3Event,
  email: User['email'],
) {
  const prisma = event.context.prisma

  const user = await prisma.user.findUnique({
    where: { email },
  })
  return user
}

export async function createUser(
  event: H3Event,
  input: Prisma.UserCreateInput,
) {
  const hashedPassword = input.password
    ? hashSync(input.password, 12)
    : undefined

  const config = getConfig()
  const prisma = event.context.prisma

  const user = await prisma.user.create({
    data: {
      ...input,
      password: hashedPassword,
      role: config.private.registration.defaultRole as User['role'] ?? 'user',
      provider: input.provider ?? 'default',
      picture: input.picture || generateAvatar(input.name),
    },
  })

  return user
}

function generateAvatar(name: string) {
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

export async function changePassword(
  event: H3Event,
  userId: User['id'],
  password: string,
) {
  const hashedPassword = hashSync(password, 12)

  const prisma = event.context.prisma

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  })
}

export async function setUserEmailVerified(event: H3Event, userId: User['id']) {
  const prisma = event.context.prisma

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      verified: true,
    },
    select: {
      id: true,
    },
  })
}

export function verifyPassword(password: string, hashedPassword: string) {
  return compareSync(password, hashedPassword)
}

export async function setUserRequestedPasswordReset(
  event: H3Event,
  userId: User['id'],
  state: boolean,
) {
  const prisma = event.context.prisma

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      requestedPasswordReset: state,
    },
    select: {
      id: true,
    },
  })
}
