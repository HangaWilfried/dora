<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StatisticCard from '@/components/StatisticCard.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import { Users2, CalendarDays, ClockAlert, FileSpreadsheet } from 'lucide-vue-next'

const { t } = useI18n({
  messages: {
    en: {
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
</script>

<template>
  <BaseContainer>
    <div class="flex flex-col gap-0.5">
      <h1 class="font-bold">{{ t('hello', { user: 'dora' }) }}</h1>
      <span>{{ t('guide') }}</span>
    </div>
    <div class="grid grid-cols-5 gap-4">
      <StatisticCard
        :label="t('cards.totalRequests')"
        :icon="FileSpreadsheet"
        :value="0"
        theme="secondary"
      />
      <StatisticCard :label="t('cards.pending')" :icon="ClockAlert" :value="0" theme="warning" />
      <StatisticCard :label="t('cards.approved')" :icon="CalendarDays" :value="0" theme="success" />
      <StatisticCard :label="t('cards.rejected')" :icon="CalendarDays" :value="0" theme="error" />
      <StatisticCard :label="t('cards.totalEmployees')" :icon="Users2" :value="0" theme="primary" />
    </div>
    <div class="card">
      <h1 class="card-title text-sm font-normal">{{ t('recentlyActivities.label') }}</h1>
    </div>
  </BaseContainer>
</template>
