// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    public: {
      public_available_key: process.env.PUBLIC_AVAILABLE_KEY,
      firebase_api_key: process.env.FIREBASE_API_KEY, // can be overridden by API_SECRET environment variable
      firebase_auth_domain: process.env.FIREBASE_AUTH_DOMAIN, // can be overridden by API_SECRET environment variable
      firebase_project_id: process.env.FIREBASE_PROJECT_ID, // can be overridden by API_SECRET environment variable
      firebase_storage_bucket: process.env.FIREBASE_STORAGE_BUCKET, // can be overridden by API_SECRET environment variable
      firebase_messaging_sender_id: process.env.FIREBASE_MESSAGING_SENDER_ID, // can be overridden by API_SECRET environment variable
      firebase_app_id: process.env.FIREBASE_APP_ID, // can be overridden by API_SECRET environment variable
      firebase_measurement_id: process.env.FIREBASE_MEASUREMENT_ID, // can be overridden by API_SECRET environment variable/ can be overridden by PUBLIC_API_BASE environment variable
    }
  },
})
