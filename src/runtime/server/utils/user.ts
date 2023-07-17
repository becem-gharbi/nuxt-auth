import { prisma } from "./prisma";
import  { } from "@prisma/client";
import bcrypt from "bcryptjs";
import { privateConfig } from "./config";
import { withQuery } from "ufo";
import type { User } from "../../types";

export async function findUser(where: Prisma.UserWhereUniqueInput) {
  const user = await prisma.user.findUnique({
    where,
  });
  return user;
}

export async function createUser(input: Prisma.UserCreateInput) {
  const hashedPassword = input.password
    ? bcrypt.hashSync(input.password, 12)
    : undefined;

  const user = await prisma.user.create({
    data: {
      ...input,
      password: hashedPassword,
      role: privateConfig.registration?.defaultRole || "user",
      provider: input.provider || "default",
      picture:
        input.picture ||
        withQuery("https://ui-avatars.com/api", {
          name: input.name,
          background: "random",
        }),
    },
  });

  return user;
}

export async function changePassword(userId: User["id"], password: string) {
  const hashedPassword = bcrypt.hashSync(password, 12);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
}

export async function setUserEmailVerified(userId: User["id"]) {
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
  return bcrypt.compareSync(password, hashedPassword);
}

export async function findUsers(args: Prisma.UserFindManyArgs) {
  const users = await prisma.user.findMany(args);
  return users;
}

export async function editUser(
  userId: User["id"],
  data: Prisma.UserUpdateInput
) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });

  return user;
}

export async function countUsers(args: Prisma.UserCountArgs) {
  const count = await prisma.user.count(args);
  return count;
}
