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
      children: [
        { path: '', component: () => import('@/views/DashboardPage.vue') },
        { path: 'employees', component: () => import('@/views/EmployeeListPage.vue') },
        { path: 'vacations', component: () => import('@/views/AllVacationsPage.vue') },
        { path: 'me/vacations', component: () => import('@/views/MyVacationsPage.vue') },
        { path: 'settings', component: () => import('@/views/SettingsPage.vue') },
        { path: 'settings/:id', component: () => import('@/views/HolidayTypeDetailsPage.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

const { isAuthenticated } = useAuth()

router.beforeEach((to) => {
  if (isAuthenticated() || to.meta.isPublic) {
    return
  }
  return '/login'
})

export default router
