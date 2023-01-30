import { fileURLToPath } from "url";
import type { PublicConfig, PrivateConfig } from "./runtime/types";

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
  addTemplate,
} from "@nuxt/kit";

import { defu } from "defu";

export interface ModuleOptions extends PrivateConfig, PublicConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bg-dev/nuxt-auth",
    configKey: "auth",
  },

  defaults: {
    accessToken: {
      cookieName: "auth_access_token",
      jwtSecret: "hqkdsjfHJKBH568FGD",
      maxAge: 30 * 60,
    },

    refreshToken: {
      cookieName: "auth_refresh_token",
      jwtSecret: "sldkfbld6f8gdfgKJBLK",
      maxAge: 7 * 24 * 60 * 60,
    },

    smtp: {
      host: "",
      port: 587,
      user: "",
      pass: "",
      from: "",
    },

    baseUrl: "http://localhost:3000",
    enableGlobalAuthMiddleware: false,
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/home",
      callback: "/auth/callback",
      passwordReset: "/auth/password-reset",
      emailVerify: "/auth/email-verify",
    },

    registration: {
      enable: true,
      defaultRole: "user",
      requireEmailVerification: true,
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

    addServerHandler({
      route: "/api/auth/password/request",
      handler: resolve(runtimeDir, "server/api/auth/password/request.post"),
    });

    addServerHandler({
      route: "/api/auth/password/reset",
      handler: resolve(runtimeDir, "server/api/auth/password/reset.put"),
    });

    addServerHandler({
      route: "/api/auth/password/change",
      handler: resolve(runtimeDir, "server/api/auth/password/change.put"),
    });

    addServerHandler({
      route: "/api/auth/email/request",
      handler: resolve(runtimeDir, "server/api/auth/email/request.post"),
    });

    addServerHandler({
      route: "/api/auth/email/verify",
      handler: resolve(runtimeDir, "server/api/auth/email/verify.get"),
    });

    addServerHandler({
      route: "/api/auth/session/revoke",
      handler: resolve(
        runtimeDir,
        "server/api/auth/session/revoke/index.delete"
      ),
    });

    addServerHandler({
      route: "/api/auth/session/revoke/all",
      handler: resolve(runtimeDir, "server/api/auth/session/revoke/all.delete"),
    });

    addServerHandler({
      route: "/api/auth/session/refresh",
      handler: resolve(runtimeDir, "server/api/auth/session/refresh.post"),
    });

    addServerHandler({
      route: "/api/auth/session",
      handler: resolve(runtimeDir, "server/api/auth/session/index.get"),
    });

    //Create virtual imports for server-side
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolve(runtimeDir)],
        }
      );
      nitroConfig.alias["#auth"] = resolve(runtimeDir, "server/utils");
    });

    addTemplate({
      filename: "types/auth.d.ts",
      getContents: () =>
        [
          "declare module '#auth' {",
          `  const verifyAccessToken: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').verifyAccessToken`,
          `  const getAccessTokenFromHeader: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').getAccessTokenFromHeader`,
          `  const sendMail: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').sendMail`,
          `  const handleError: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').handleError`,
          `  const prisma: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').prisma`,
          "}",
        ].join("\n"),
    });

    // Register module types
    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, "types/auth.d.ts"),
      });
    });

    //Initialize the module options
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},

      auth: {
        accessToken: options.accessToken,

        refreshToken: options.refreshToken,

        emailTemplates: options.emailTemplates,

        oauth: options.oauth,

        smtp: options.smtp,

        prisma: options.prisma,

        registration: options.registration,
      },

      public: {
        auth: {
          baseUrl: options.baseUrl,
          enableGlobalAuthMiddleware: options.enableGlobalAuthMiddleware,
          redirect: {
            login: options.redirect.login,
            logout: options.redirect.logout,
            home: options.redirect.home,
            callback: options.redirect.callback,
            passwordReset: options.redirect.passwordReset,
            emailVerify: options.redirect.emailVerify,
          },
        },
      },
    });
  },
});
