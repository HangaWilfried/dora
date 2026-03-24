<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/plugins/useAuth.ts'
import { LogOut, Users2, Calendar, Settings, LayoutDashboard } from 'lucide-vue-next'

const authState = useAuth()
const user = authState.getUserInfo()

const { t } = useI18n({
  messages: {
    en: {
      logout: 'Logout',
      dashboard: 'Dashboard',
      vacations: 'Vacations',
      employees: 'Employees',
      settings: 'Settings',
    },
    fr: {
      logout: 'Se déconnecter',
      dashboard: 'Tableau de bord',
      vacations: 'Congés',
      employees: 'Employés',
      settings: 'Paramètres',
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
    icon: Calendar,
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
  <div class="drawer-side is-drawer-close:overflow-visible">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div
      :class="[
        'bg-base-300 is-drawer-close:w-14 is-drawer-open:w-64',
        'border-secondary-content/20 flex min-h-full flex-col justify-between border-r',
      ]"
    >
      <ul class="menu w-full grow">
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
          <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Logout">
            <LogOut class="size-4" />
            <span class="is-drawer-close:hidden">{{ t('logout') }}</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
