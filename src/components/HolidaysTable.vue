<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { HolidayDTO } from '@/services/leavemanager'

import AcceptHolidayRequest from '@/components/AcceptHolidayRequest.vue'
import RejectHolidayRequest from '@/components/RejectHolidayRequest.vue'

defineProps<{ holidays: HolidayDTO[] }>()

const { t } = useI18n({
  messages: {
    en: {
      title: 'All leaves',
      empty: 'No leave requests created',
      description: 'Manage employee leave requests',
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
      title: 'Tous les congés',
      empty: 'Aucune requête de congé créée',
      description: 'Gérez les demandes de congés des employés',
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

<template></template>
