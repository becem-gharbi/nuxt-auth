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
  nuxtBaseUrl: string;
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
    configKey: "directusAuth",
  },
  defaults: {
    nuxtBaseUrl: "http://localhost:3000",
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
      route: "/api/login",
      handler: resolve(runtimeDir, "server/login.post"),
    });

    //Initialize the module options
    nuxt.options.runtimeConfig.public.directusAuth = defu(
      nuxt.options.runtimeConfig.public.directusAuth,
      { ...options }
    );
  },
});
