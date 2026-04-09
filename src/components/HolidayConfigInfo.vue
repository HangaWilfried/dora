<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { useAuth } from '@/plugins/useAuth'
import { HolidayConfigService, HolidayService } from '@/services/leavemanager'

import DoraLoading from '@/components/DoraLoading.vue'
import { useI18n } from 'vue-i18n'

const { holidayTypeId } = defineProps<{ holidayTypeId: number }>()

const { isRequestFailed, getErrorMessage, setError } = useError()
const { hasRole } = useAuth()

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

const {
  data: myHolidays,
  isLoading: holidaysLoading,
  isFetching: holidaysFetching,
} = useQuery({
  queryKey: ['myHolidays', holidayTypeId],
  queryFn: async () => {
    const response = await HolidayService.getAllMyHolidays()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data || []
  },
})

const usedRequests = computed(() => {
  const holidays = myHolidays.value || []
  return holidays.filter(
    (holiday) =>
      holiday.type?.id === holidayTypeId &&
      (holiday.status === 'VALIDATED' || holiday.status === 'APPROVED'),
  ).length
})

const remainingCredits = computed(() => {
  const config = holidayConfig.value
  if (!config || typeof config.numberOfTime !== 'number') {
    return null
  }
  return Math.max(config.numberOfTime - usedRequests.value, 0)
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
      credits: {
        remaining: '{remaining} remaining ({used} used out of {total})',
      },
    },
    fr: {
      time: {
        year: '{value}x/an',
        day: '{value} jours',
      },
      credits: {
        remaining: '{remaining} restants ({used} utilisés sur {total})',
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
      <DoraLoading v-if="isLoading || isFetching || holidaysLoading || holidaysFetching" />
      <template v-else-if="holidayConfig">
        <h1 class="text-base-content text-sm font-medium">{{ holidayConfig.description }}</h1>
        <div class="text-secondary-content flex flex-col gap-2">
          <div class="flex items-center gap-8">
            <span>{{ t('time.year', { value: holidayConfig.numberOfTime }) }}</span>
            <span>{{ t('time.day', { value: dayInterval }) }}</span>
          </div>
          <div class="border-t border-base-200 pt-2 text-success text-sm" v-if="!hasRole('SUPER_ADMIN') && typeof holidayConfig.numberOfTime === 'number'">
            <span>
              {{ t('credits.remaining', { used: usedRequests, total: holidayConfig.numberOfTime, remaining: remainingCredits }) }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
