<script setup lang="ts">
import { computed } from 'vue'
import { MoveRight } from 'lucide-vue-next'

import { getLocaleDate } from '@/plugins/date'
import type { HolidayDTO } from '@/services/leavemanager'
import { useHolidayAllowedAction } from '@/composables/useHolidayAllowedAction.ts'

import HolidayStatus from '@/components/HolidayStatus.vue'
import EditVacationRequest from '@/components/EditVacationRequest.vue'
import SubmitVacationRequest from '@/components/SubmitVacationRequest.vue'
import DeleteVacationRequest from '@/components/DeleteVacationRequest.vue'
import RevokeVacationRequest from '@/components/RevokeVacationRequest.vue'

const { holiday } = defineProps<{ holiday: HolidayDTO }>()

const status = computed(() => holiday.status)
const { canManuallyChangeHolidayStatus, canDeleteHoliday } = useHolidayAllowedAction(status)
</script>

<template>
  <div class="text-secondary-content card flex flex-row items-start justify-between text-xs">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="text-base-content text-sm font-medium">{{ holiday.title }}</span>
        <HolidayStatus :status="holiday.status" />
      </div>
      <span>{{ holiday.type?.name }}</span>
      <div class="flex items-center gap-0.5">
        <span>{{ getLocaleDate(holiday.period?.startDate) }}</span>
        <MoveRight class="size-4" />
        <span>{{ getLocaleDate(holiday.period?.endDate) }}</span>
      </div>
      <span>{{ holiday.description }}</span>
    </div>
    <div class="flex items-center gap-2">
      <template v-if="canManuallyChangeHolidayStatus">
        <template v-if="holiday.status === 'DRAFT'">
          <SubmitVacationRequest :holiday-id="holiday.id" />
          <EditVacationRequest :holiday="holiday" />
        </template>
        <RevokeVacationRequest v-else :holiday-id="holiday.id" />
      </template>
      <DeleteVacationRequest v-if="canDeleteHoliday" :holiday-id="holiday.id" />
    </div>
  </div>
</template>
