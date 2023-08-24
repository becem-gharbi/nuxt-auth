import { PrismaClient } from "@prisma/client/edge";
import { defineNitroPlugin } from "#imports";
import { getConfig } from "#auth";

export default defineNitroPlugin((nitroApp) => {
  const config = getConfig();
  const prisma = new PrismaClient(config.private.prisma);

  nitroApp.hooks.hook("request", (event) => {
    event.context.prisma = prisma;
  });
});
