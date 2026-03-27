<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { HolidayTypeDTO } from '@/services/leavemanager'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

defineProps<{ holidayType: HolidayTypeDTO }>()
</script>

<template>
  <RouterLink
    :to="`/settings/${holidayType.id}`"
    class="text-secondary-content card flex flex-row items-start justify-between text-xs"
  >
    <div class="flex flex-col gap-2">
      <h1 class="text-base-content text-sm font-medium">{{ holidayType.name }}</h1>
      <span>{{ holidayType.description }}</span>
    </div>
    <ButtonWrapper class="btn-square btn-ghost">
      <ChevronRight class="text-secondary-content/60 size-5 stroke-2" />
    </ButtonWrapper>
  </RouterLink>
</template>
