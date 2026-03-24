<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'

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
      class="rounded-md w-fit bg-primary text-primary-content flex items-center justify-center p-2"
    >
      <Calendar class="size-4" />
    </div>
    <span class="text-sm font-bold">LAO-CONGE</span>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.row {
  @apply flex gap-2 items-center;
}

.column {
  @apply flex flex-col items-center gap-2;
}
</style>
