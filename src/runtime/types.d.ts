import type {
  User as PrismaUser,
  Provider as PrismaProvider,
  Prisma,
  Role,
} from "@prisma/client";

export type Provider = Exclude<PrismaProvider, "default">;

export interface User extends Omit<PrismaUser, "password"> {}

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type ResetPasswordPayload = {
  userId: number;
};

export type EmailVerifyPayload = {
  userId: number;
};

export type AccessTokenPayload = {
  userId: number;
  userRole: string;
};

export type RefreshTokenPayload = {
  id: number;
  uid: string;
  userId: number;
};

export type PrivateConfig = {
  accessToken: {
    cookieName?: string;
    jwtSecret: string;
    maxAge?: number;
    customClaims?: Record<string, any>;
  };

  refreshToken: {
    cookieName?: string;
    jwtSecret: string;
    maxAge?: number;
  };

  oauth?: Partial<
    Record<
      Provider,
      {
        clientId: string;
        clientSecret: string;
        scopes: string;
        authorizeUrl: string;
        tokenUrl: string;
        userUrl: string;
      }
    >
  >;

  emailTemplates?: {
    passwordReset?: string;
    emailVerify?: string;
  };

  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };

  prisma?: Prisma.PrismaClientOptions;

  registration: {
    enable?: boolean;
    requireEmailVerification?: boolean;
    passwordValidationRegex?: string;
    defaultRole: Role;
  };
};

export type PublicConfig = {
  baseUrl: string;
  enableGlobalAuthMiddleware?: boolean;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback: string;
    passwordReset: string;
    emailVerify: string;
  };
};
