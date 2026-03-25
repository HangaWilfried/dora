<script setup lang="ts">
import type { HolidayTypeDTO } from '@/services/leavemanager'
import DeleteHolidayType from '@/components/DeleteHolidayType.vue'

defineProps<{ holidayType: HolidayTypeDTO }>()
</script>

<template>
  <div class="text-secondary-content card flex flex-row items-start justify-between text-xs">
    <div class="flex flex-col gap-2">
      <h1 class="text-base-content text-sm font-medium">{{ holidayType.name }}</h1>
      <span>{{ holidayType.description }}</span>
    </div>
    <div class="flex items-center gap-2">
      <DeleteHolidayType :holiday-type-id="holidayType.id" />
    </div>
  </div>
</template>
