import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { HolidayStatusDTO } from '@/services/leavemanager'

export const useHolidayAllowedAction = (status: MaybeRefOrGetter<HolidayStatusDTO | undefined>) => {
  const canManuallyChangeHolidayStatus = computed(() => {
    return toValue(status) === 'PUBLISH'
  })

  const canDeleteHoliday = computed(() => {
    return ['DRAFT', 'PUBLISH', 'IN_PROGRESS'].some((x) => x === toValue(status))
  })

  return {
    canDeleteHoliday,
    canManuallyChangeHolidayStatus,
  }
}
