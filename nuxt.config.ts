// https://nuxt.com/docs/api/configuration/nuxt-config
import "dotenv/config";
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    XATA_API_KEY: process.env.XATA_API_KEY, // ✅ Apenas acessível no backend!
    jwtSecret: process.env.JWT_SECRET,
    XATA_DATABASE_URL: process.env.XATA_DATABASE_URL,

    public: {
      // 🔹 Apenas variáveis seguras devem ser colocadas aqui
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
