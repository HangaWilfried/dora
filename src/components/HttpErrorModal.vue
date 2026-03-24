<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session.ts'
import ModalWrapper from '@/components/ModalWrapper.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const session = useSessionStore()
const { t } = useI18n({
  messages: {
    en: { close: 'Close' },
    fr: { close: 'Fermer' },
  },
})
</script>

<template>
  <ModalWrapper v-if="session.error.openModal" :elevation="50">
    <div class="w-xs">
      <div class="flex flex-col items-center gap-2">
        <h1>{{ session.error.status }}</h1>
        <p>{{ session.error.message }}</p>
      </div>
      <div class="flex justify-end">
        <ButtonWrapper @click="session.closeErrorModal()" class="btn-primary">
          {{ t('close') }}
        </ButtonWrapper>
      </div>
    </div>
  </ModalWrapper>
</template>
