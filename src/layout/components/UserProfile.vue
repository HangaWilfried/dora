<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/plugins/useAuth.ts'

const authState = useAuth()
const user = authState.getUserInfo()

const { t } = useI18n({
  messages: {
    en: {
      ADMIN: 'Admin',
      EMPLOYEE: 'Employee',
      SUPER_ADMIN: 'Super Admin',
    },
    fr: {
      EMPLOYEE: 'Employé',
      ADMIN: 'Administrateur',
      SUPER_ADMIN: 'Super Administrateur',
    },
  },
})
</script>

<template>
  <div
    v-if="!user.isNull"
    class="text-secondary-content/80 flex flex-row items-center gap-4 py-4 text-sm leading-1"
  >
    <div
      class="bg-base-200 flex size-8 shrink-0 items-center justify-center rounded-full uppercase"
    >
      {{ user.email[0] }}
    </div>
    <div class="flex flex-col items-start gap-1 text-xs leading-tight break-keep">
      <span>{{ user.email }}</span>
      <span class="text-xs">{{ t(user.role) }}</span>
    </div>
  </div>
</template>
