<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { t } = useI18n({
  messages: {
    en: {
      new: 'New',
    },
    fr: {
      new: 'Nouveau',
    },
  },
})
</script>

<template>
  <AlertDialog>
    <template #trigger>
      <ButtonWrapper class="btn-primary">
        <Plus class="size-5 stroke-2" />
        <span>{{ t('new') }}</span>
      </ButtonWrapper>
    </template>
    <template #default></template>
  </AlertDialog>
</template>
