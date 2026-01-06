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
  modules: [
    'nuxt-lucide-icons',
    'nuxt-swiper',
    'nuxt-mongoose',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    'nuxt-security',
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
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
      apiBase: 'https://api-tapmed.sse.net.vn/api',
      ADMIN_ID: process.env.ADMIN_ID,
      API_KEY: process.env.API_KEY,
    }
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  // SEO modules configuration
  site: {
    url: 'https://siduoc.com',
    name: 'Sỉ Dược',
    description: 'Sỉ Dược - nhà cung cấp dược phẩm uy tín',
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ]
  },
  robots: {
    disallow: ['/auth/*'],
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
    },
    xssValidator: false,
    rateLimiter: false,
  }
})