import type {
  User as PrismaUser,
  Provider as PrismaProvider,
  Prisma,
  Role,
  RefreshToken as PrismaRefreshToken,
} from "@prisma/client";

export type Provider = Exclude<PrismaProvider, "default">;

export interface User extends Omit<PrismaUser, "password"> {}

export interface RefreshToken extends Omit<PrismaRefreshToken, "uid"> {}

export interface Session {
  id: number | string;
  current: boolean;
  userId: number | string;
  ua: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export type ResetPasswordPayload = {
  userId: number | string;
};

export type EmailVerifyPayload = {
  userId: number | string;
};

export type AccessTokenPayload = {
  userId: number | string;
  sessionId: number | string;
  userRole: string;
};

export type RefreshTokenPayload = {
  id: number | string;
  uid: string;
  userId: number | string;
};

export type PrivateConfig = {
  accessToken: {
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

  smtp?: {
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

  webhookKey?: string;

  admin: {
    enable?: boolean;
  };
};

export type PublicConfig = {
  baseUrl: string;
  enableGlobalAuthMiddleware?: boolean;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback?: string;
    passwordReset?: string;
    emailVerify?: string;
  };
};
