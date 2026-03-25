<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError'
import { HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import HolidayCard from '@/components/HolidayCard.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import CreateVacationForm from '@/components/CreateVacationForm.vue'

const { t } = useI18n({
  messages: {
    en: {
      title: 'My leaves',
      empty: 'No leaves found',
      description: 'Manage your leave requests',
    },
    fr: {
      title: 'Mes congés',
      empty: 'Aucun congé crée',
      description: 'Gérez vos demandes de congés',
    },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: holidays,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['vacations'],
  queryFn: async () => {
    const response = await HolidayService.getAllMyHolidays()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
})
</script>

<template>
  <BaseContainer>
    <div class="flex items-center justify-between">
      <PageTitle>
        <h1 class="font-medium">{{ t('title') }}</h1>
        <span class="text-xs">{{ t('description') }}</span>
      </PageTitle>
      <CreateVacationForm />
    </div>
    <DoraLoading v-if="isLoading || isFetching" />
    <div v-else-if="holidays && holidays.length" class="space-y-2">
      <HolidayCard v-for="holiday in holidays" :key="holiday.id" :holiday="holiday" />
    </div>
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </BaseContainer>
</template>
