<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trash2 } from 'lucide-vue-next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

import { useError } from '@/composables/useError'
import { HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'
import CreateHolidayType from '@/components/CreateHolidayType.vue'

const { t } = useI18n({
  messages: {
    en: {
      title: 'Settings',
      description: 'Configure leave types and rules',
      tabs: {
        types: 'Leave types',
        configs: 'Configurations',
      },
      empty: 'No leave types found',
    },
    fr: {
      title: 'Paramètres',
      description: 'Configuration des types et règles de congés',
      tabs: {
        types: 'Types de congés',
        configs: 'Configurations',
      },
      empty: 'Aucun type de congé créé',
    },
  },
})

const activeTab = ref<'types' | 'configs'>('types')
const queryClient = useQueryClient()
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

const { mutate: deleteHolidayType } = useMutation({
  mutationFn: async (holidayTypeId: number) => {
    const response = await HolidayService.deleteHolidayTypeById({ path: { holidayTypeId } })
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['holidayTypes'] })
  },
})
</script>

<template>
  <BaseContainer>
    <PageTitle>
      <h1 class="font-medium">{{ t('title') }}</h1>
      <span class="text-xs">{{ t('description') }}</span>
    </PageTitle>

    <div class="mt-2 flex gap-1">
      <button
        :class="[
          'rounded-md px-4 py-2 text-sm transition-colors',
          activeTab === 'types'
            ? 'bg-base-100 border-base-content/10 border font-medium shadow-sm'
            : 'text-secondary-content hover:text-base-content',
        ]"
        @click="activeTab = 'types'"
      >
        {{ t('tabs.types') }}
      </button>
      <button
        :class="[
          'rounded-md px-4 py-2 text-sm transition-colors',
          activeTab === 'configs'
            ? 'bg-base-100 border-base-content/10 border font-medium shadow-sm'
            : 'text-secondary-content hover:text-base-content',
        ]"
        @click="activeTab = 'configs'"
      >
        {{ t('tabs.configs') }}
      </button>
    </div>

    <template v-if="activeTab === 'types'">
      <div class="flex justify-end">
        <CreateHolidayType />
      </div>

      <DoraLoading v-if="isLoading || isFetching" />

      <template v-else>
        <div v-if="holidayTypes && holidayTypes.length" class="flex flex-col gap-2">
          <div
            v-for="type in holidayTypes"
            :key="type.id"
            class="card flex flex-row items-center justify-between"
          >
            <div class="flex flex-col gap-0.5">
              <span class="text-sm font-medium">{{ type.name }}</span>
              <span class="text-secondary-content text-xs">{{ type.description }}</span>
            </div>
            <ButtonWrapper
              class="btn-ghost btn-square btn-sm"
              @click="type.id && deleteHolidayType(type.id)"
            >
              <Trash2 class="text-error size-4 stroke-2" />
            </ButtonWrapper>
          </div>
        </div>

        <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
      </template>
    </template>

    <template v-if="activeTab === 'configs'">
      <!-- Configurations tab — à implémenter -->
    </template>
  </BaseContainer>
</template>