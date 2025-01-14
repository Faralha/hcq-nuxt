// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vite-pwa/nuxt", "@formkit/auto-animate/nuxt"],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE,
    },
  },
  ssr: false,
  css: [
    '~/assets/css/custom.css'
  ]
});