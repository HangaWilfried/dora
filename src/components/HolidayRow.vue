<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MoveRight } from 'lucide-vue-next'

import { useAuth } from '@/plugins/useAuth.ts'
import { getLocaleDate } from '@/plugins/date.ts'
import { useHolidayAllowedAction } from '@/composables/useHolidayAllowedAction.ts'

import type { HolidayDTO } from '@/services/leavemanager'
import HolidayStatus from '@/components/HolidayStatus.vue'
import AcceptHolidayRequest from '@/components/AcceptHolidayRequest.vue'
import RejectHolidayRequest from '@/components/RejectHolidayRequest.vue'

const { holiday } = defineProps<{ holiday: HolidayDTO }>()
const { getUserInfo } = useAuth()

const status = computed(() => holiday.status)
const { canManuallyChangeHolidayStatus } = useHolidayAllowedAction(status)

const isCurrentUserAuthor = computed(() => {
  const user = getUserInfo()
  if (user.isNull) {
    return false
  }
  return user.email === holiday.createdBy?.email
})

const { t } = useI18n({
  messages: {
    en: { you: 'Your request' },
    fr: { you: 'Votre demande' },
  },
})
</script>

<template>
  <tr>
    <td class="text-sm">{{ holiday.createdBy?.firstname }} {{ holiday.createdBy?.lastname }}</td>
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
      <span v-if="isCurrentUserAuthor" class="badge badge-warning bg-warning/10 text-warning">
        {{ t('you') }}
      </span>
      <div v-else-if="canManuallyChangeHolidayStatus" class="flex items-center gap-2">
        <AcceptHolidayRequest :holiday-id="holiday.id" />
        <RejectHolidayRequest :holiday-id="holiday.id" />
      </div>
    </td>
  </tr>
</template>
