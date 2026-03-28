<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { HolidayConfigService } from '@/services/leavemanager'

import DoraLoading from '@/components/DoraLoading.vue'
import { useI18n } from 'vue-i18n'

const { holidayTypeId } = defineProps<{ holidayTypeId: number }>()

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: holidayConfig,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: computed(() => [holidayTypeId, 'holidayConfig']),
  queryFn: async ({ queryKey }) => {
    const [holidayTypeId] = queryKey

    if (!holidayTypeId) {
      throw new Error('Missing holidayTypeId.')
    }

    const response = await HolidayConfigService.getActivatedHolidayConfigByHolidayTypeId({
      path: { holidayTypeId: Number(holidayTypeId) },
    })
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
})

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

const dayInterval = computed(() => {
  const config = holidayConfig.value
  if (config) {
    return `${config.minimumOfDays}-${config.maximumOfDays}`
  }
  return '-'
})
</script>

<template>
  <div class="border-info rounded-lg border p-0.5">
    <div class="bg-primary/15 flex flex-col gap-2 rounded-lg p-2">
      <DoraLoading v-if="isLoading || isFetching" />
      <template v-else-if="holidayConfig">
        <h1 class="text-base-content text-sm font-medium">{{ holidayConfig.description }}</h1>
        <div class="text-secondary-content flex items-center gap-8">
          <span>{{ t('time.year', { value: holidayConfig.numberOfTime }) }}</span>
          <span>{{ t('time.day', { value: dayInterval }) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
