// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
    vscode: {
      enabled: true,
    },
  },
  css: ['~/assets/css/main.scss'],
  modules: ['nuxt-lucide-icons', 'nuxt-swiper', 'nuxt-mongoose'],
  app: {
    head: {
      title: 'Sỉ Dược',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1,maximum-scale=1' },
        { name: 'description', content: 'Sỉ Dược - nhà cung cấp dược phẩm uy tín' },
      ],
      // script: [
      //   { src: '/lib/bootstrap-5.3.8.min.js'},
      // ],
    },
  },
  lucide: {
    namePrefix: '',
  }, vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
        },
      }
    }
    , optimizeDeps: {
      include: ['quill-blot-formatter']
    }
  },

  plugins: ['~/plugins/bootstrap.client.ts', '~/plugins/appServices.ts'],
  runtimeConfig: {
    public: {
      apiBase: 'https://api-tapmed.sse.net.vn/api'
    }
  },
   build: {
    transpile: ['@vuepic/vue-datepicker']
  }
})