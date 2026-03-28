<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { getLocaleDate } from '@/plugins/date'
import type { HolidayDTO } from '@/services/leavemanager'

import HolidayStatus from '@/components/HolidayStatus.vue'
import AcceptHolidayRequest from '@/components/AcceptHolidayRequest.vue'
import RejectHolidayRequest from '@/components/RejectHolidayRequest.vue'

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
        <tr v-for="holiday in holidays" :key="holiday.id">
          <td class="text-sm">
            {{ holiday.createdBy?.firstname }} {{ holiday.createdBy?.lastname }}
          </td>
          <td class="text-sm">{{ holiday.title }}</td>
          <td class="text-sm">{{ holiday.type?.name }}</td>
          <td class="flex items-center gap-1 text-sm">
            <span>{{ getLocaleDate(holiday.period?.startDate) }}</span>
            <MoveRight class="size-4" />
            <span>{{ getLocaleDate(holiday.period?.endDate) }}</span>
          </td>
          <td>
            <HolidayStatus :status="holiday.status" />
          </td>
          <td>
            <div class="flex items-center gap-2">
              <AcceptHolidayRequest :holiday-id="holiday.id" />
              <RejectHolidayRequest :holiday-id="holiday.id" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
