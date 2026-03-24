import { useAuth } from '@/plugins/useAuth.ts'
import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { isPublic: true },
      component: () => import('@/views/auth/LoginPage.vue'),
    },
    {
      path: '/',
      component: AppLayout,
      children: [],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

const { isAuthenticated } = useAuth()

router.beforeEach((to, _, next) => {
  // if (isAuthenticated() || to.meta.isPublic) {
  //   return next()
  // }
  // return next('/login')
  next()
})

export default router
