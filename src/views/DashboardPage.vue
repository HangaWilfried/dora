<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, type Component } from 'vue'
import { Info, Users2, CalendarDays, ClockAlert, FileSpreadsheet } from 'lucide-vue-next'

import { useAuth } from '@/plugins/useAuth'
import { useQuery } from '@tanstack/vue-query'
import { useError } from '@/composables/useError.ts'
import { AdminService, HolidayService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import StatisticCard from '@/components/StatisticCard.vue'

type RoleType = 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN'
type ThemeType = 'primary' | 'secondary' | 'success' | 'warning' | 'error'

interface Card {
  id: string
  label: string
  icon: Component
  value: number
  theme: ThemeType
  requiredRoles?: RoleType[]
}

const { t } = useI18n({
  messages: {
    en: {
      notReady: 'In development',
      hello: 'Hello, {user}',
      guide: 'Here is an overview of your leave space',
      cards: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        totalRequests: 'Total requests',
        totalEmployees: 'Total employees',
      },
      recentlyActivities: {
        label: 'Recent activity',
      },
    },
    fr: {
      notReady: 'En cours de developpement',
      hello: 'Bonjour, {user}',
      guide: 'Voici un aperçu de votre espace congés',
      cards: {
        rejected: 'Rejetés',
        pending: 'En attente',
        approved: 'Approuvés',
        totalRequests: 'Total demandes',
        totalEmployees: 'Total employés',
      },
      recentlyActivities: {
        label: 'Activité récente',
      },
    },
  },
})

const { hasRole, getUserInfo } = useAuth()
const userInfo = getUserInfo()

const { isRequestFailed, getErrorMessage, setError } = useError()

const employeesResponse = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await AdminService.getAllEmployees()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data
  },
})

const holidaysResponse = useQuery({
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

const isLoading = computed(() => {
  return (
    employeesResponse.isLoading.value ||
    employeesResponse.isFetching.value ||
    holidaysResponse.isLoading.value ||
    holidaysResponse.isFetching.value
  )
})

const cards = computed((): Card[] => {
  const users = employeesResponse.data.value
  const holidays = holidaysResponse.data.value

  const rejectedHolidays = holidays?.filter((x) => x.status === 'REFUSED')
  const approvedHolidays = holidays?.filter((x) => x.status === 'VALIDATED')
  const pendingHolidays = holidays?.filter((x) => x.status === 'PUBLISH')
  const currentUserTotalHolidays = holidays?.filter((x) => {
    if (userInfo.isNull) {
      return true
    }

    return x.createdBy?.email === userInfo.email
  })

  const allCards: Card[] = [
    {
      id: 'totalRequests',
      label: t('cards.totalRequests'),
      icon: FileSpreadsheet,
      value: currentUserTotalHolidays?.length ?? 0,
      theme: 'secondary',
      requiredRoles: undefined,
    },
    {
      id: 'pending',
      label: t('cards.pending'),
      icon: ClockAlert,
      value: pendingHolidays?.length ?? 0,
      theme: 'warning',
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'approved',
      label: t('cards.approved'),
      icon: CalendarDays,
      value: approvedHolidays?.length ?? 0,
      theme: 'success',
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'rejected',
      label: t('cards.rejected'),
      icon: CalendarDays,
      value: rejectedHolidays?.length ?? 0,
      theme: 'error',
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'totalEmployees',
      label: t('cards.totalEmployees'),
      icon: Users2,
      theme: 'primary',
      value: users?.length ?? 0,
      requiredRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
  ]

  return allCards.filter((card) => {
    if (!card.requiredRoles) {
      return true
    }

    return hasRole(card.requiredRoles)
  })
})
</script>

<template>
  <BaseContainer>
    <PageTitle>
      <h1 v-if="!userInfo.isNull" class="font-medium">
        {{ t('hello', { user: userInfo.email }) }}
      </h1>
      <span class="text-xs">{{ t('guide') }}</span>
    </PageTitle>
    <div class="grid grid-cols-5 gap-4">
      <DoraLoading v-if="isLoading" />
      <template v-else>
        <StatisticCard
          v-for="card in cards"
          :key="card.id"
          :label="card.label"
          :icon="card.icon"
          :value="card.value"
          :theme="card.theme"
        />
      </template>
    </div>
    <div class="card">
      <h1 class="card-title text-sm font-normal">
        <Info class="text-warning size-6" />
        <span>{{ t('recentlyActivities.label') }}</span>
      </h1>
      <span class="font-italic text-warning px-8 text-xs">
        {{ t('notReady') }}
      </span>
    </div>
  </BaseContainer>
</template>
