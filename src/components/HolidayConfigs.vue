<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { HolidayConfigService } from '@/services/leavemanager'

import DoraLoading from '@/components/DoraLoading.vue'
import HolidayConfigCard from '@/components/HolidayConfigCard.vue'
import CreateHolidayConfig from '@/components/CreateHolidayConfig.vue'

const { id } = defineProps<{ id?: number }>()

const { t } = useI18n({
  messages: {
    en: {
      config: 'Configurations',
      empty: 'No configurations found',
    },
    fr: {
      config: 'Configurations',
      empty: 'Aucune configuration crée',
    },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  isLoading,
  isFetching,
  data: holidayConfigs,
  refetch: refetchConfigs,
} = useQuery({
  queryKey: computed(() => [id, 'holidayConfigs']),
  queryFn: async ({ queryKey }) => {
    const [holidayTypeId] = queryKey

    if (!holidayTypeId) {
      throw new Error('Missing holidayTypeId.')
    }

    const response = await HolidayConfigService.getAllHolidayConfigByHolidayType({
      path: { holidayTypeId: Number(holidayTypeId) },
    })
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
    <div class="flex items-center justify-between">
      <span class="text-sm">{{ t('config') }}</span>
      <CreateHolidayConfig :refetch-config="refetchConfigs" />
    </div>
    <DoraLoading v-if="isLoading || isFetching" />
    <div v-else-if="holidayConfigs && holidayConfigs.length" class="space-y-2">
      <HolidayConfigCard
        :key="config.id"
        :holiday-config="config"
        :refetch-config="refetchConfigs"
        v-for="config in holidayConfigs"
      />
    </div>
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </section>
</template>
