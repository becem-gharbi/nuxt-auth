import type {
  User as PrismaUser,
  Provider as PrismaProvider,
  Prisma,
} from "@prisma/client";

export type Provider = Exclude<PrismaProvider, "default">;

export type User = Exclude<PrismaUser, "password">;

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
