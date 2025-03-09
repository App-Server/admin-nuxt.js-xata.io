// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    XATA_API_KEY: process.env.XATA_API_KEY,
    XATA_DATABASE_URL: process.env.XATA_DATABASE_URL, // Adicionando ao runtimeConfig
    public: {
      XATA_API_KEY: process.env.XATA_API_KEY // Se precisar acessar no frontend
    }
  },
  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js", defer: true },
      ],
    }
  },
})
