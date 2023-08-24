import { PrismaClient } from "@prisma/client";
import { defineNitroPlugin } from "#imports";
import { privateConfig } from "#auth";

export default defineNitroPlugin((nitroApp) => {
  const prisma = new PrismaClient(privateConfig.prisma);

  nitroApp.hooks.hook("request", (event) => {
    event.context.prisma = prisma;
  });
});
