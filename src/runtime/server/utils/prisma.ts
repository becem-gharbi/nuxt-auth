import { PrismaClient } from "@prisma/client";
import { privateConfig } from "./config";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  globalThis.prisma || new PrismaClient(privateConfig.prisma);
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export { prisma };
