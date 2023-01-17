import { User as PrismaUser, Provider as PrismaProvider } from "@prisma/client";

export type Provider = Exclude<PrismaProvider, "default">;

export type User = Exclude<PrismaUser, "password">;
