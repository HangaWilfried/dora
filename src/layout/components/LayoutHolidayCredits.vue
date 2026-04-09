<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

import { useError } from '@/composables/useError.ts'
import { useAuth } from '@/plugins/useAuth'
import { HolidayConfigService, HolidayService } from '@/services/leavemanager'

const { isRequestFailed, getErrorMessage, setError } = useError()
const { hasRole } = useAuth()

const { data: holidayConfigs } = useQuery({
  queryKey: ['activeHolidayConfigs'],
  queryFn: async () => {
    const response = await HolidayConfigService.getAllHolidayConfigs()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data || []
  },
})

const { data: myHolidays } = useQuery({
  queryKey: ['myHolidays'],
  queryFn: async () => {
    const response = await HolidayService.getAllMyHolidays()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data || []
  },
})

const { data: holidayTypes } = useQuery({
  queryKey: ['holidayTypes'],
  queryFn: async () => {
    const response = await HolidayService.getAllHolidayTypes()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data || []
  },
})

const holidayTypeMap = computed(() => {
  return (holidayTypes.value || []).reduce<Record<number, string>>((map, type) => {
    if (typeof type.id === 'number') {
      map[type.id] = type.name || ''
    }
    return map
  }, {})
})

const activeHolidaySummaries = computed(() => {
  const activeConfigs = (holidayConfigs.value || []).filter((config) => config.isActivate)

  return activeConfigs
    .filter((config) => typeof config.holidayTypeId === 'number')
    .map((config) => {
      const holidayTypeId = config.holidayTypeId as number
      const totalCredits = config.numberOfTime ?? 0
      const usedRequests = (myHolidays.value || []).filter(
        (holiday) =>
          holiday.type?.id === holidayTypeId &&
          ['VALIDATED', 'APPROVED'].includes(holiday.status ?? ''),
      ).length

      return {
        holidayTypeId,
        typeName: holidayTypeMap.value[holidayTypeId] || config.description || `#${holidayTypeId}`,
        description: config.description || '',
        totalCredits,
        usedRequests,
        remainingCredits: Math.max(totalCredits - usedRequests, 0),
      }
    })
})

const shouldDisplayCredits = computed(
  () => !hasRole('SUPER_ADMIN') && activeHolidaySummaries.value.length > 0,
)

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
  messages: {
    en: {
      layout: {
        creditsTitle: 'Leave credits',
        unknownType: 'Unknown leave type',
        remainingLabel: 'Remaining',
        usedLabel: 'Used',
      },
      credits: {
        details: '{remaining} remaining — {used}/{total} used',
      },
    },
    fr: {
      layout: {
        creditsTitle: 'Crédits de congé',
        unknownType: 'Type de congé inconnu',
        remainingLabel: 'Restants',
        usedLabel: 'Utilisés',
      },
      credits: {
        details: '{remaining} restants — {used}/{total} utilisés',
      },
    },
  },
})
</script>

<template>
  <div v-if="shouldDisplayCredits" class="border-base-200 bg-base-100 border-t px-4 py-4 text-sm">
    <div class="mb-3 text-xs uppercase tracking-[0.2em] text-secondary-content">
      {{ t('layout.creditsTitle') }}
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="summary in activeHolidaySummaries"
        :key="summary.holidayTypeId"
        class="card overflow-hidden rounded-3xl border border-base-200 bg-base-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-base-content/80">{{ summary.typeName }}</p>
        <div class="px-5 pb-5 pt-4">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <p class="text-2xl font-semibold text-base-content">{{ summary.remainingCredits }}</p>
              <p class="text-xs uppercase tracking-[0.2em] text-secondary-content/80">
                {{ t('layout.remainingLabel') }}
              </p>
            </div>
            <span class="rounded-full bg-success/10 px-3 py-1 text-success text-xs font-semibold">
              {{ t('layout.usedLabel') }} {{ summary.usedRequests }} / {{ summary.totalCredits }}
            </span>
          </div>
          <div class="rounded-2xl bg-base-300 h-2 overflow-hidden">
            <div
              class="h-full bg-primary"
              :style="{ width: summary.totalCredits ? `${Math.round((summary.remainingCredits / summary.totalCredits) * 100)}%` : '0%' }"
            />
          </div>
          <p class="mt-3 text-xs text-secondary-content">
            {{ t('credits.details', {
              remaining: summary.remainingCredits,
              used: summary.usedRequests,
              total: summary.totalCredits,
            }) }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
