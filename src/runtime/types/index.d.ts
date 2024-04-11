import type {
  User as PrismaUser,
  Provider as PrismaProvider,
  RefreshToken as PrismaRefreshToken,
  Prisma,
  Role,
  PrismaClient
} from '@prisma/client'

declare module '#app' {
  interface NuxtApp {
    $auth: {
      fetch: typeof $fetch;
      _refreshPromise: Promise<any> | null;
    };
  }
  interface RuntimeNuxtHooks {
    'auth:loggedIn': (state: boolean) => void;
  }
}

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient;
    auth: AccessTokenPayload | undefined;
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'auth:email': (from: string, msg: MailMessage) => Promise<void> |void
  }
}

export type Provider = Exclude<PrismaProvider, 'default'>;

export interface User extends Omit<PrismaUser, 'password'> { }

export interface RefreshToken extends Omit<PrismaRefreshToken, 'uid'> { }

export interface Session {
  id: RefreshToken['id'];
  current: boolean;
  ua: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
};

export type ResetPasswordPayload = {
  userId: User['id'];
};

export type EmailVerifyPayload = {
  userId: User['id'];
};

export type AccessTokenPayload = {
  userId: User['id'];
  sessionId: Session['id'];
  userRole: string;
  fingerprint: string | null;
};

export type RefreshTokenPayload = {
  id: RefreshToken['id'];
  uid: string;
  userId: User['id'];
};

interface MailSendgridProvider {
  name: 'sendgrid';
  apiKey: string;
}

interface MailResendProvider {
  name: 'resend',
  apiKey: string
}

interface MailHookProvider {
  name: 'hook'
}

export interface AuthenticationData {
  access_token: string;
  expires_in: number;
}

export type PrivateConfigWithoutBackend = {
  backendEnabled: false,
  refreshToken: {
    cookieName?: string
  }
}

export type PrivateConfigWithBackend = {
  backendEnabled: true;

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

  email?: {
    from: string;
    provider: MailSendgridProvider | MailResendProvider | MailHookProvider;
    templates?: {
      passwordReset?: string;
      emailVerify?: string;
    };
  };

  registration: {
    enable?: boolean;
    requireEmailVerification?: boolean;
    passwordValidationRegex?: string;
    defaultRole: Role;
  };

  webhookKey?: string;
};

export type PublicConfig = {
  backendEnabled?: boolean;
  backendBaseUrl?: string;
  baseUrl: string;
  enableGlobalAuthMiddleware?: boolean;
  loggedInFlagName?: string;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback?: string;
    passwordReset?: string;
    emailVerify?: string;
  };
}

export type PrivateConfig = PrivateConfigWithBackend | PrivateConfigWithoutBackend

export interface Response { status: string }
