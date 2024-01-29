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
  primevue: {
    options: {
      unstyled: true
    },
    importPT: { from: path.resolve(__dirname, './presets/lara/') as string, as: 'lara' }
  },
  colorMode: {
    classSuffix: ''
  },
  css: [
    'primeicons/primeicons.css', 
  ],
  tailwindcss: {
    config: {
        content: [
            "presets/**/*.{js,vue,ts}"
        ],
    }
  }
})
