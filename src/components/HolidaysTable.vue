<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { HolidayDTO } from '@/services/leavemanager'

import HolidayRow from '@/components/HolidayRow.vue'

defineProps<{ holidays: HolidayDTO[] }>()

const { t } = useI18n({
  messages: {
    en: {
      table: {
        employee: 'Employee',
        title: 'Title',
        type: 'Type',
        period: 'Period',
        status: 'Status',
        actions: 'Actions',
      },
    },
    fr: {
      table: {
        employee: 'Employé',
        title: 'Titre',
        type: 'Type',
        period: 'Période',
        status: 'Statut',
        actions: 'Actions',
      },
    },
  },
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table-zebra table">
      <thead>
        <tr>
          <th>{{ t('table.employee') }}</th>
          <th>{{ t('table.title') }}</th>
          <th>{{ t('table.type') }}</th>
          <th>{{ t('table.period') }}</th>
          <th>{{ t('table.status') }}</th>
          <th>{{ t('table.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <HolidayRow v-for="holiday in holidays" :key="holiday.id" :holiday="holiday" />
      </tbody>
    </table>
  </div>
</template>
