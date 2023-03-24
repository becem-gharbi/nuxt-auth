import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { privateConfig } from "./config";
import { withQuery } from "ufo";

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

export async function changePassword(userId: number, password: string) {
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

export async function setUserEmailVerified(userId: number) {
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

export async function editUser(id: number, data: Prisma.UserUpdateInput) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return user;
}
