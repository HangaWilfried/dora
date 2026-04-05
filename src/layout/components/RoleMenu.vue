<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Users2, Settings, CalendarDays, CalendarRange, LayoutDashboard } from 'lucide-vue-next'

import { useAuth } from '@/plugins/useAuth'

import AppLogo from '@/components/AppLogo.vue'
import UserProfile from '@/layout/components/UserProfile.vue'
import CloseSession from '@/layout/components/CloseSession.vue'

const { t } = useI18n({
  messages: {
    en: {
      settings: 'Settings',
      dashboard: 'Dashboard',
      vacations: 'Vacations',
      employees: 'Employees',
      myVacations: 'My vacations',
    },
    fr: {
      vacations: 'Congés',
      employees: 'Employés',
      settings: 'Paramètres',
      myVacations: 'Mes congés',
      dashboard: 'Tableau de bord',
    },
  },
})

const { hasRole } = useAuth()

const allMenus = [
  {
    path: '/',
    name: 'dashboard',
    icon: LayoutDashboard,
    requiredRoles: undefined,
  },
  {
    path: '/vacations',
    name: 'vacations',
    icon: CalendarRange,
    requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    path: '/me/vacations',
    name: 'myVacations',
    icon: CalendarDays,
    requiredRoles: ['EMPLOYEE', 'ADMIN'],
  },
  {
    path: '/employees',
    name: 'employees',
    icon: Users2,
    requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    path: '/settings',
    name: 'settings',
    icon: Settings,
    requiredRoles: ['SUPER_ADMIN'],
  },
]

const menus = computed(() => {
  return allMenus.filter((menu) => {
    if (!menu.requiredRoles) {
      return true
    }

    return hasRole(menu.requiredRoles as never)
  })
})
</script>

<template>
  <div
    :class="[
      'bg-base-300 divide-secondary-content/20 flex min-h-full flex-col divide-y',
      'is-drawer-close:w-14 is-drawer-open:w-64 border-secondary-content/20 w-64 border-r',
    ]"
  >
    <div class="p-4">
      <AppLogo />
    </div>
    <ul class="menu w-full grow space-y-2 p-4">
      <li v-for="menu in menus" :key="menu.name">
        <RouterLink
          :to="menu.path"
          :data-tip="t(menu.name)"
          exact-active-class="bg-primary/10 text-primary"
          class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
        >
          <component :is="menu.icon" class="size-4 text-current" />
          <span class="is-drawer-close:hidden">{{ t(menu.name) }}</span>
        </RouterLink>
      </li>
    </ul>
    <ul class="menu w-full py-4">
      <UserProfile />
      <CloseSession />
    </ul>
  </div>
</template>
