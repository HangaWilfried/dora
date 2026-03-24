<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    direction?: 'column' | 'row'
  }>(),
  {
    direction: 'row',
  },
)
</script>

<template>
  <div :class="direction">
    <div
      class="bg-primary text-primary-content flex w-fit items-center justify-center rounded-md p-2"
    >
      <CalendarDays class="size-4" />
    </div>
    <span class="text-sm font-medium">LAO-CONGE</span>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.row {
  @apply flex items-center gap-2;
}

.column {
  @apply flex flex-col items-center gap-2;
}
</style>
