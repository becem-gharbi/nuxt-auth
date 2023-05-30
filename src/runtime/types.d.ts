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
  id: RefreshToken["id"];
  current: boolean;
  userId: User["id"];
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
  userId: User["id"];
};

export type EmailVerifyPayload = {
  userId: User["id"];
};

export type AccessTokenPayload = {
  userId: User["id"];
  sessionId: Session["id"];
  userRole: string;
};

export type RefreshTokenPayload = {
  id: RefreshToken["id"];
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
