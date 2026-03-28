<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError'
import { HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import HolidayFilters from '@/components/HolidayFilters.vue'
import HolidaysTable from '@/components/HolidaysTable.vue'

const { t } = useI18n({
  messages: {
    en: {
      empty: 'No leave requests found',
      title: 'All leaves',
      description: 'Manage employee leave requests',
    },
    fr: {
      empty: 'Aucune demande de congé trouvée',
      title: 'Tous les congés',
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

const searchCriteria = reactive({
  queryString: '',
  status: '',
})

const filteredHolidays = computed(() => {
  if (!holidays.value) {
    return []
  }

  return holidays.value.filter((holiday) => {
    const matchesQuery =
      !searchCriteria.queryString ||
      holiday.title?.toLowerCase().includes(searchCriteria.queryString.toLowerCase()) ||
      `${holiday.createdBy?.firstname} ${holiday.createdBy?.lastname}`
        .toLowerCase()
        .includes(searchCriteria.queryString.toLowerCase()) ||
      holiday.type?.name?.toLowerCase().includes(searchCriteria.queryString.toLowerCase())

    const matchesStatus = !searchCriteria.status || holiday.status === searchCriteria.status

    return matchesQuery && matchesStatus
  })
})
</script>

<template>
  <BaseContainer>
    <PageTitle>
      <h1 class="font-medium">{{ t('title') }}</h1>
      <span class="text-xs">{{ t('description') }}</span>
    </PageTitle>
    <HolidayFilters v-model="searchCriteria" />
    <DoraLoading v-if="isLoading || isFetching" />
    <HolidaysTable v-else-if="filteredHolidays.length" :holidays="filteredHolidays" />
    <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
  </BaseContainer>
</template>
