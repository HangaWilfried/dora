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
      path: '/unauthorized',
      name: 'unauthorized',
      meta: { isPublic: true },
      component: () => import('@/views/UnauthorizedPage.vue'),
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', component: () => import('@/views/DashboardPage.vue') },
        { path: 'employees', component: () => import('@/views/EmployeeListPage.vue') },
        {
          path: 'vacations',
          component: () => import('@/views/AllVacationsPage.vue'),
          meta: { requiredRoles: ['ADMIN', 'SUPER_ADMIN'] },
        },
        {
          path: 'me/vacations',
          component: () => import('@/views/MyVacationsPage.vue'),
          meta: { requiredRoles: ['ADMIN', 'EMPLOYEE'] },
        },
        {
          path: 'settings',
          component: () => import('@/views/SettingsPage.vue'),
          meta: { requiredRoles: ['SUPER_ADMIN'] },
        },
        {
          path: 'settings/:id',
          component: () => import('@/views/HolidayTypeDetailsPage.vue'),
          meta: { requiredRoles: ['SUPER_ADMIN'] },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

const { isAuthenticated, hasRole } = useAuth()

router.beforeEach((to) => {
  if (isAuthenticated() || to.meta.isPublic) {
    if (to.meta.requiredRoles && !to.meta.isPublic) {
      const requiredRoles = Array.isArray(to.meta.requiredRoles)
        ? to.meta.requiredRoles
        : [to.meta.requiredRoles]

      if (!hasRole(requiredRoles as never)) {
        return '/unauthorized'
      }
    }

    return
  }

  return '/login'
})

export default router
