import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { HolidayStatusDTO } from '@/services/leavemanager'

export const useHolidayAllowedAction = (status: MaybeRefOrGetter<HolidayStatusDTO | undefined>) => {
  const canManuallyChangeHolidayStatus = computed(() => {
    return ['DRAFT', 'PUBLISH'].some((x) => x === toValue(status))
  })

  const canDeleteHoliday = computed(() => {
    return ['DRAFT', 'PUBLISH', 'REFUSED', 'PASSED'].some((x) => x === toValue(status))
  })

  return {
    canDeleteHoliday,
    canManuallyChangeHolidayStatus,
  }
}
