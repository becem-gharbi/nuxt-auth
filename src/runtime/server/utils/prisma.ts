import Prisma from "@prisma/client";
import { privateConfig } from "./config";

declare global {
  var prisma: Prisma.PrismaClient | undefined;
}

const prisma: Prisma.PrismaClient =
  globalThis.prisma || new Prisma.PrismaClient(privateConfig.prisma);
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export { prisma };
