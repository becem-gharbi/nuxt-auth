import { fileURLToPath } from "url";

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
} from "@nuxt/kit";

import { defu } from "defu";

export interface ModuleOptions {
  jwtSecret: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenMaxAge: number;

  oauthClientId: string;
  oauthClientSecret: string;
  oauthAuthorizeUrl: string;
  oauthGetTokenUrl: string;
  oauthGetUserUrl: string;

  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;

  baseUrl: string;
  enableGlobalAuthMiddleware: boolean;
  refreshTokenCookieName: string;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback: string;
    resetPassword: string;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bg-dev/nuxt-auth",
    configKey: "auth",
  },

  defaults: {
    jwtSecret: "",
    accessTokenSecret: "",
    refreshTokenSecret: "",
    accessTokenExpiresIn: "7s",
    refreshTokenMaxAge: 3600,

    oauthClientId: "",
    oauthClientSecret: "",
    oauthAuthorizeUrl: "",
    oauthGetTokenUrl: "",
    oauthGetUserUrl: "",

    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",

    baseUrl: "http://localhost:3000",
    enableGlobalAuthMiddleware: false,
    refreshTokenCookieName: "directus_refresh_token",
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/home",
      callback: "/auth/callback",
      resetPassword: "/auth/reset-password",
    },
  },

  setup(options, nuxt) {
    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Add plugins
    const plugin = resolve(runtimeDir, "plugin");
    addPlugin(plugin);

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Add server routes
    addServerHandler({
      route: "/api/auth/login",
      handler: resolve(runtimeDir, "server/api/auth/login/index.post"),
    });

    addServerHandler({
      route: "/api/auth/login/:provider",
      handler: resolve(runtimeDir, "server/api/auth/login/[provider].get"),
    });

    addServerHandler({
      route: "/api/auth/login/:provider/callback",
      handler: resolve(
        runtimeDir,
        "server/api/auth/login/[provider]/callback.get"
      ),
    });

    addServerHandler({
      route: "/api/auth/refresh",
      handler: resolve(runtimeDir, "server/api/auth/refresh.post"),
    });

    addServerHandler({
      route: "/api/auth/register",
      handler: resolve(runtimeDir, "server/api/auth/register.post"),
    });

    addServerHandler({
      route: "/api/auth/me",
      handler: resolve(runtimeDir, "server/api/auth/me.get"),
    });

    addServerHandler({
      route: "/api/auth/logout",
      handler: resolve(runtimeDir, "server/api/auth/logout.post"),
    });

    //Initialize the module options
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      auth: {
        jwtSecret: options.jwtSecret,
        accessTokenSecret: options.accessTokenSecret,
        refreshTokenSecret: options.refreshTokenSecret,
        accessTokenExpiresIn: options.accessTokenExpiresIn,
        refreshTokenMaxAge: options.refreshTokenMaxAge,

        oauthClientId: options.oauthClientId,
        oauthClientSecret: options.oauthClientSecret,
        oauthAuthorizeUrl: options.oauthAuthorizeUrl,
        oauthGetTokenUrl: options.oauthGetTokenUrl,
        oauthGetUserUrl: options.oauthGetUserUrl,

        smtpHost: options.smtpHost,
        smtpPort: options.smtpPort,
        smtpUser: options.smtpUser,
        smtpPass: options.smtpPass,
        smtpFrom: options.smtpFrom,
      },
      public: {
        auth: {
          baseUrl: options.baseUrl,
          enableGlobalAuthMiddleware: options.enableGlobalAuthMiddleware,
          refreshTokenCookieName: options.refreshTokenCookieName,
          redirect: {
            login: options.redirect.login,
            logout: options.redirect.logout,
            home: options.redirect.home,
            callback: options.redirect.callback,
            resetPassword: options.redirect.resetPassword,
          },
        },
      },
    });
  },
});
