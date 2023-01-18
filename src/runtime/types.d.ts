import type {
  User as PrismaUser,
  Provider as PrismaProvider,
} from "@prisma/client";

import type { AsyncData } from "#imports";

import type { FetchError } from "ofetch";

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
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenMaxAge: number;

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

  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
};

export type PublicConfig = {
  baseUrl: string;
  enableGlobalAuthMiddleware: boolean;
  refreshTokenCookieName: string;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback: string;
    passwordReset: string;
    emailVerify: string;
  };
};

export type ErrorT = {
  message: string;
};

export type UseFetchDataT<T> = T | null;

export type UseFetchErrorT = FetchError<ErrorT> | null;

export type FetchReturn<T> = Promise<
  AsyncData<UseFetchDataT<T>, UseFetchErrorT>
>;
