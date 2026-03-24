<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PanelRightOpen } from 'lucide-vue-next'

const { t } = useI18n({
  messages: {
    en: { title: 'Leave Manager', logout: 'Logout' },
    fr: { title: 'Gestion des Congés', logout: 'Déconnexion' },
  },
})
</script>

<template>
  <nav class="bg-base-300 border-secondary-content/20 flex w-full border-b">
    <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
      <PanelRightOpen class="size-4" />
    </label>
    <div class="flex grow items-center justify-between px-4">
      <h1>{{ t('title') }}</h1>
    </div>
  </nav>
</template>
