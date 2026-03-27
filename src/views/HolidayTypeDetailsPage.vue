<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError.ts'
import { HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import HolidayConfigs from '@/components/HolidayConfigs.vue'
import EditHolidayType from '@/components/EditHolidayType.vue'
import DeleteHolidayType from '@/components/DeleteHolidayType.vue'

const route = useRoute()

const { t } = useI18n({
  messages: {
    en: {
      settings: 'Settings',
      config: 'Configurations',
      empty: 'No leave types found',
    },
    fr: {
      settings: 'Paramètres',
      config: 'Configurations',
      empty: 'Aucun type de congé créé',
    },
  },
})

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  isLoading,
  isFetching,
  data: holidayType,
} = useQuery({
  queryKey: computed(() => [route.params.id as string, 'holidayType']),
  queryFn: async ({ queryKey }) => {
    const holidayTypeId = Number(queryKey[0])

    const response = await HolidayService.getHolidayTypeById({
      path: { holidayTypeId },
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
  <BaseContainer>
    <RouterLink to="/settings" class="btn btn-ghost btn-square text-secondary-content/60">
      <ArrowLeft class="size-4" />
      <span class="text-xs">{{ t('settings') }}</span>
    </RouterLink>
    <DoraLoading v-if="isLoading || isFetching" />
    <template v-else-if="holidayType">
      <div class="flex items-center justify-between">
        <PageTitle>
          <h1 class="font-medium">{{ holidayType.name }}</h1>
          <span class="text-xs">{{ holidayType.description }}</span>
        </PageTitle>
        <div class="flex items-center gap-2">
          <EditHolidayType :holiday-type="holidayType" />
          <DeleteHolidayType :holiday-type-id="holidayType.id" />
        </div>
      </div>
      <HolidayConfigs :id="holidayType.id" />
    </template>
  </BaseContainer>
</template>
