<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HolidayConfigDTO } from '@/services/leavemanager'

import ActivateConfig from '@/components/ActivateConfig.vue'
import DeactivateConfig from '@/components/DeactivateConfig.vue'

const { holidayConfig } = defineProps<{ holidayConfig: HolidayConfigDTO }>()

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
  messages: {
    en: {
      time: {
        year: '{value}x/an',
        day: '{value} jours',
      },
    },
    fr: {
      time: {
        year: '{value}x/an',
        day: '{value} jours',
      },
    },
  },
})

const dayInterval = computed(() => `${holidayConfig.minimumOfDays}-${holidayConfig.maximumOfDays}`)
</script>

<template>
  <div class="card flex flex-row items-start justify-between text-xs">
    <div class="flex flex-col gap-2">
      <h1 class="text-base-content text-sm font-medium">{{ holidayConfig.description }}</h1>
      <div class="text-secondary-content flex items-center gap-8">
        <span>{{ t('time.year', { value: holidayConfig.numberOfTime }) }}</span>
        <span>{{ t('time.day', { value: dayInterval }) }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <DeactivateConfig v-if="holidayConfig.isActivate" :holiday-config-id="holidayConfig.id" />
      <ActivateConfig v-else :holiday-config-id="holidayConfig.id" />
    </div>
  </div>
</template>
