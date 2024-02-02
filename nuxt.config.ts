import path from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-primevue'
  ],
  components: {
    global: true,
    dirs: ['~/components']
  },
  primevue: {
    options: {
      unstyled: true
    },
    importPT: { from: '~/presets/lara' as string, as: 'lara' }
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
        content: [
            "presets/**/*.{js,vue,ts}"
        ],
    }
  },
})
