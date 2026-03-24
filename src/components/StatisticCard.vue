<script setup lang="ts">
import type { Component } from 'vue'

const { theme = 'primary' } = defineProps<{
  label: string
  icon: Component
  value: string | number
  theme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}>()
</script>

<template>
  <div class="card flex flex-row items-center justify-between gap-2">
    <div class="flex flex-col gap-2">
      <h2>{{ label }}</h2>
      <span class="text-xl font-bold">{{ value }}</span>
    </div>
    <div :class="['flex items-center justify-center rounded-lg p-2', theme]">
      <component class="size-5 text-current" :is="icon" />
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/style.css";

.primary {
  @apply text-primary bg-primary/10;
}

.secondary {
  @apply text-secondary-content bg-secondary/60;
}

.warning {
  @apply text-warning bg-warning/10;
}

.success {
  @apply text-success bg-success/10;
}

.error {
  @apply text-error bg-error/10;
}
</style>
