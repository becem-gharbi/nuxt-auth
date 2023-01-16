import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function findUser(where: Prisma.UserWhereUniqueInput) {
  const user = await prisma.user.findUnique({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      blocked: true,
      verified: true,
      metadata: true,
      role: true,
      provider: true,
    },
  });
  return user;
}

export async function createUser(input: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data: input,
  });
  return user;
}
