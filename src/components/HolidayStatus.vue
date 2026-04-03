<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HolidayStatusDTO } from '@/services/leavemanager'

const props = defineProps<{ status?: HolidayStatusDTO }>()

const badgeClass = computed(() => {
  const base = 'text-xs py-1 px-2 rounded-lg font-medium'

  switch (props.status) {
    case 'DRAFT':
      return `${base} bg-neutral text-secondary-content`
    case 'PUBLISH':
      return `${base} bg-info/10 text-info`
    case 'APPROVED':
      return `${base} bg-success/10 text-success`
    case 'VALIDATED':
      return `${base} bg-success/10 text-success`
    case 'REFUSED':
      return `${base} bg-error/10 text-error`
    case 'IN_PROGRESS':
      return `${base} bg-warning/10 text-warning`
    case 'PASSED':
      return `${base} bg-neutral/10 text-neutral`
    default:
      return `${base} bg-neutral/10 text-neutral`
  }
})

const { t } = useI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    en: {
      status: {
        DRAFT: 'Draft',
        PUBLISH: 'Published',
        APPROVED: 'Approved',
        VALIDATED: 'Validated',
        REFUSED: 'Refused',
        IN_PROGRESS: 'In progress',
        PASSED: 'Passed',
      },
    },
    fr: {
      status: {
        DRAFT: 'Brouillon',
        PUBLISH: 'Publié',
        APPROVED: 'Approuvé',
        VALIDATED: 'Validé',
        REFUSED: 'Refusé',
        IN_PROGRESS: 'En cours',
        PASSED: 'Expiré',
      },
    },
  },
})

const label = computed(() => {
  return props.status ? t(`status.${props.status}`) : ''
})
</script>

<template>
  <span :class="badgeClass">{{ label }}</span>
</template>
