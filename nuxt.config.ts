// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    baseURL: '/QRScanner/'
  },
  vite: {
    server: {
      allowedHosts: ['dev.mcjiaozi.com']
    }
  }
})
