<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { HolidayService } from '@/services/leavemanager'

import DoraLoading from '@/components/DoraLoading.vue'
import HolidayTypeCard from '@/components/HolidayTypeCard.vue'
import CreateHolidayType from '@/components/CreateHolidayType.vue'

const { t } = useI18n({
  messages: {
    en: { empty: 'No leave types found' },
    fr: { empty: 'Aucun type de congé crée' },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: holidayTypes,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['holidayTypes'],
  queryFn: async () => {
    const response = await HolidayService.getAllHolidayTypes()
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
    <div v-else-if="holidayTypes && holidayTypes.length" class="space-y-2">
      <HolidayTypeCard
        v-for="holidayType in holidayTypes"
        :key="holidayType.id"
        :holiday-type="holidayType"
      />
    </div>
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </section>
</template>
