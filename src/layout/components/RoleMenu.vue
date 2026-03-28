<script setup lang="ts">
import {
  LogOut,
  Users2,
  Settings,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/plugins/useAuth.ts'
import AppLogo from '@/components/AppLogo.vue'

const authState = useAuth()
const user = authState.getUserInfo()

const { t } = useI18n({
  messages: {
    en: {
      logout: 'Logout',
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
      logout: 'Se déconnecter',
      myVacations: 'Mes congés',
      dashboard: 'Tableau de bord',
    },
  },
})

const menus = [
  {
    path: '/',
    name: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/vacations',
    name: 'vacations',
    icon: CalendarRange,
  },
  {
    path: '/me/vacations',
    name: 'myVacations',
    icon: CalendarDays,
  },
  {
    path: '/employees',
    name: 'employees',
    icon: Users2,
  },
  {
    path: '/settings',
    name: 'settings',
    icon: Settings,
  },
]
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
    <ul class="menu w-full grow p-4">
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
    <ul class="menu w-full">
      <li class="flex flex-col gap-2">
        <span>{{ user.lastname }}</span>
        <span>{{ user.email }}</span>
      </li>
      <li @click="authState.logout">
        <button
          class="is-drawer-close:tooltip is-drawer-close:tooltip-right btn btn-info"
          data-tip="Logout"
        >
          <LogOut class="size-4" />
          <span class="is-drawer-close:hidden">{{ t('logout') }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
