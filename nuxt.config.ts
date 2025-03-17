import PrimeUI from "tailwindcss-primeui";
import Lara from "@primeuix/themes/lara";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  modules: [
    '@nuxtjs/color-mode',
    // 'nuxt-primevue',
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    '@nuxtjs/color-mode',
  ],

  components: {
    global: true,
    dirs: ['~/components', '~/layouts', '~/composables']
  },

  primevue: {
    options: {
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: ".p-dark",
        },
      },

      ripple: true,
    },
    autoImport: true,
  },

  colorMode: {
    classSuffix: ''
  },

  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css',
  ],

  tailwindcss: {
    config: {
      plugins: [PrimeUI],
      darkMode: ["class", ".p-dark"],
    },
  },

  compatibilityDate: '2025-03-11',
})