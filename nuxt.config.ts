// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/stylelint-module",
    "@nuxt/test-utils/module",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/styles/main.scss"],
  runtimeConfig: {
    public: {
      apiBaseUrl: "",
    },
  },
  typescript: { typeCheck: true },
  i18n: {
    defaultLocale: "en",
    strategy: "no_prefix",
    locales: [
      { code: "en", language: "en-GB", name: "English (UK)", file: "en.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  stylelint: {
    lintOnStart: false,
    emitWarning: true,
    emitError: true,
    lintDirtyOnly: true,
  },
});
