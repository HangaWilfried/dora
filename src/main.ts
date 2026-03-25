import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'

import './plugins/clients'
import App from './App.vue'
import router from './router'
import { i18n } from './plugins/locale'
import { useAuth } from '@/plugins/useAuth.ts'
import { queryClient, toastProvider } from '@/plugins/toast.ts'

const pinia = createPinia()
const app = createApp(App)

useAuth().initAuth()

app
  .use(pinia)
  .use(router)
  .use(VueQueryPlugin, { queryClient })
  .use(i18n)
  .use(toastProvider)
  .mount('#app')
