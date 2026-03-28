<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Lock } from 'lucide-vue-next'

const { t } = useI18n({
  messages: {
    en: {
      title: 'Access Denied',
      description: 'You do not have permission to access this page.',
      back: 'Go back home',
    },
    fr: {
      title: 'Accès refusé',
      description: 'Vous n\'avez pas la permission d\'accéder à cette page.',
      back: 'Retourner à l\'accueil',
    },
  },
})

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-200 p-4">
    <div class="flex flex-col items-center gap-6 rounded-lg bg-base-100 p-8 shadow-lg">
      <div class="flex items-center justify-center rounded-full bg-error/10 p-4">
        <Lock class="size-12 text-error" />
      </div>
      <div class="flex flex-col items-center gap-2 text-center">
        <h1 class="text-2xl font-bold">{{ t('title') }}</h1>
        <p class="text-sm text-secondary-content">{{ t('description') }}</p>
      </div>
      <button @click="goHome" class="btn btn-primary px-8">
        {{ t('back') }}
      </button>
    </div>
  </div>
</template>
