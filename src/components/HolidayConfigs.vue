<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { HolidayConfigService } from '@/services/leavemanager'

import DoraLoading from '@/components/DoraLoading.vue'
import CreateHolidayType from '@/components/CreateHolidayType.vue'
import HolidayConfigCard from '@/components/HolidayConfigCard.vue'

const { t } = useI18n({
  messages: {
    en: { empty: 'No configurations found' },
    fr: { empty: 'Aucune configuration crée' },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: holidayConfigs,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['holidayConfigs'],
  queryFn: async () => {
    const response = await HolidayConfigService.getAllHolidayConfigs()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex justify-end">
      <CreateHolidayType />
    </div>
    <DoraLoading v-if="isLoading || isFetching" />
    <div v-else-if="holidayConfigs && holidayConfigs.length" class="space-y-2">
      <HolidayConfigCard
        v-for="config in holidayConfigs"
        :key="config.id"
        :holiday-config="config"
      />
    </div>
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </section>
</template>
