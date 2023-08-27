import { hashSync, compareSync } from "./bcrypt";
import { getConfig } from "./config";
import { withQuery } from "ufo";
import type { User } from "../../types";
import type { H3Event } from "h3";
import type { Prisma } from "@prisma/client";

export async function findUser(
  event: H3Event,
  where: Prisma.UserWhereUniqueInput
) {
  const prisma = event.context.prisma;

  const user = await prisma.user.findUnique({
    where,
  });
  return user;
}

export async function createUser(
  event: H3Event,
  input: Prisma.UserCreateInput
) {
  const hashedPassword = input.password
    ? hashSync(input.password, 12)
    : undefined;

  const config = getConfig(event);
  const prisma = event.context.prisma;

  const user = await prisma.user.create({
    data: {
      ...input,
      password: hashedPassword,
      role: config.private.registration?.defaultRole || "user",
      provider: input.provider || "default",
      picture: input.picture || generateAvatar(input.name),
    },
  });

  return user;
}

function generateAvatar(name: string) {
  const url = withQuery("https://ui-avatars.com/api", {
    name: name,
    background: "random",
    length: 1,
    bold: true,
    "font-size": 0.6,
  });

  return url;
}

export async function changePassword(
  event: H3Event,
  userId: User["id"],
  password: string
) {
  const hashedPassword = hashSync(password, 12);

  const prisma = event.context.prisma;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

export async function setUserEmailVerified(event: H3Event, userId: User["id"]) {
  const prisma = event.context.prisma;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      verified: true,
    },
  });
}

export function verifyPassword(password: string, hashedPassword: string) {
  return compareSync(password, hashedPassword);
}

export async function findUsers(event: H3Event, args: Prisma.UserFindManyArgs) {
  const prisma = event.context.prisma;

  const users = await prisma.user.findMany(args);
  return users;
}

export async function editUser(
  event: H3Event,
  userId: User["id"],
  data: Prisma.UserUpdateInput
) {
  const prisma = event.context.prisma;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });

  return user;
}

export async function countUsers(event: H3Event, args: Prisma.UserCountArgs) {
  const prisma = event.context.prisma;

  const count = await prisma.user.count(args);
  return count;
}
