<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError'
import { HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import HolidayFilters from '@/components/HolidayFilters.vue'

const { t } = useI18n({
  messages: {
    en: {},
    fr: {
      title: 'Tous les congés',
      empty: 'Aucune requete congé crée',
      description: 'Gérez les demandes de congés des employés',
    },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: holidays,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['allVacations'],
  queryFn: async () => {
    const response = await HolidayService.getAllHolidays()
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
    <PageTitle>
      <h1 class="font-medium">{{ t('title') }}</h1>
      <span class="text-xs">{{ t('description') }}</span>
    </PageTitle>
    <HolidayFilters />
    <DoraLoading v-if="isLoading || isFetching" />
    <div v-else-if="holidays && holidays.length" class="space-y-2">
      <!--      display table here -->
    </div>
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </BaseContainer>
</template>
