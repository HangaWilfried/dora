<script setup lang="ts">
defineProps<{
  isLoading?: boolean
  isDisabled?: boolean
}>()
</script>

<template>
  <button class="btn disabled:opacity-50" :disabled="isLoading || isDisabled">
    <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
    <slot />
  </button>
</template>
