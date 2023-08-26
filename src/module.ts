import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
  addTemplate,
  logger,
  addServerPlugin,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import { defu } from "defu";
import type { PublicConfig, PrivateConfig } from "./runtime/types";

export interface ModuleOptions extends PrivateConfig, PublicConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    compatibility: {
      nuxt: "^3.7.0",
    },
    configKey: "auth",
  },

  defaults: {
    baseUrl: "",

    accessToken: {
      jwtSecret: "",
      maxAge: 30 * 60,
    },

    refreshToken: {
      cookieName: "auth_refresh_token",
      jwtSecret: "",
      maxAge: 7 * 24 * 60 * 60,
    },

    enableGlobalAuthMiddleware: false,

    redirect: {
      login: "",
      logout: "",
      home: "",
      callback: "",
      passwordReset: "",
      emailVerify: "",
    },

    registration: {
      enable: true,
      defaultRole: "user",
      requireEmailVerification: true,
      passwordValidationRegex: "",
    },

    admin: {
      enable: false,
    },

    prisma: {},
  },

  setup(options, nuxt) {
    if (!options.refreshToken.jwtSecret) {
      logger.warn(`[${name}] Please make sure to set refresh token's secret`);
    }

    if (!options.accessToken.jwtSecret) {
      logger.warn(`[${name}] Please make sure to set access token's secret`);
    }

    if (!options.redirect.login) {
      logger.warn(`[${name}] Please make sure to set login redirect path`);
    }

    if (!options.redirect.logout) {
      logger.warn(`[${name}] Please make sure to set logout redirect path`);
    }

    if (!options.redirect.home) {
      logger.warn(`[${name}] Please make sure to set home redirect path`);
    }

    if (!options.baseUrl) {
      logger.warn(`[${name}] Please make sure to set baseUrl`);
    }

    if (!options.registration?.enable) {
      logger.warn(`[${name}] Registration is disabled`);
    }

    if (!options.oauth && !options.email) {
      logger.warn(`[${name}] Please make sure to set email option`);
    }

    //Initialize the module options
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},

      auth: {
        accessToken: options.accessToken,

        refreshToken: options.refreshToken,

        email: options.email,

        oauth: options.oauth,

        prisma: options.prisma,

        registration: options.registration,

        webhookKey: options.webhookKey,

        admin: options.admin,
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

    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile CJS dependencies
    nuxt.options.build.transpile.push(runtimeDir, "bcryptjs");

    //Add vue plugins
    const plugin = resolve(runtimeDir, "plugin");
    addPlugin(plugin);

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Add server utils
    nuxt.options.nitro = defu(
      {
        alias: {
          "#auth": resolve("./runtime/server/utils"),
        },
      },
      nuxt.options.nitro
    );

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
          `  const getConfig: typeof import('${resolve(
            runtimeDir,
            "server/utils"
          )}').getConfig`,
          "}",
        ].join("\n"),
    });

    // Register module types
    nuxt.hook("prepare:types", (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, "types/auth.d.ts"),
      });
    });

    //Add server plugins
    const supportedEdges = [
      "cloudflare-pages",
      "netlify-edge",
      "vercel-edge",
      "cloudflare",
    ];
    const preset = nuxt.options.nitro.preset as string;
    const isEdge = supportedEdges.includes(preset);

    if (preset && isEdge) {
      logger.info(`[${name}] Detected edge environment <${preset}>`);
      const prisma = resolve(runtimeDir, "server/plugins/prisma.edge");
      addServerPlugin(prisma);
    } else {
      const prisma = resolve(runtimeDir, "server/plugins/prisma");
      addServerPlugin(prisma);
    }

    //Add server routes
    addServerHandler({
      route: "/api/auth/login",
      handler: resolve(runtimeDir, "server/api/auth/login/index.post"),
    });

    if (options.oauth) {
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
    }

    if (options.registration.enable === true) {
      addServerHandler({
        route: "/api/auth/register",
        handler: resolve(runtimeDir, "server/api/auth/register.post"),
      });
    }

    addServerHandler({
      route: "/api/auth/me",
      handler: resolve(runtimeDir, "server/api/auth/me.get"),
    });

    addServerHandler({
      route: "/api/auth/logout",
      handler: resolve(runtimeDir, "server/api/auth/logout.post"),
    });

    if (options.email) {
      addServerHandler({
        route: "/api/auth/password/request",
        handler: resolve(runtimeDir, "server/api/auth/password/request.post"),
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
        route: "/api/auth/password/reset",
        handler: resolve(runtimeDir, "server/api/auth/password/reset.put"),
      });
    }

    addServerHandler({
      route: "/api/auth/password/change",
      handler: resolve(runtimeDir, "server/api/auth/password/change.put"),
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

    if (options.webhookKey) {
      addServerHandler({
        route: "/api/auth/session/revoke/expired",
        handler: resolve(
          runtimeDir,
          "server/api/auth/session/revoke/expired.delete"
        ),
      });
    }

    if (options.admin.enable === true) {
      addServerHandler({
        route: "/api/auth/admin/users/list",
        handler: resolve(runtimeDir, "server/api/auth/admin/users/list.post"),
      });

      addServerHandler({
        route: "/api/auth/admin/users/edit",
        handler: resolve(runtimeDir, "server/api/auth/admin/users/edit.put"),
      });

      addServerHandler({
        route: "/api/auth/admin/users/count",
        handler: resolve(runtimeDir, "server/api/auth/admin/users/count.post"),
      });
    }
  },
});

declare module "#app" {
  interface RuntimeNuxtHooks {
    "auth:loggedIn": (state: boolean) => void;
  }
}
