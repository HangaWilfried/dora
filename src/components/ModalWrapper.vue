<script setup lang="ts">
const { elevation = 20 } = defineProps<{ elevation?: number }>()
</script>

<template>
  <teleport to="body">
    <div
      :class="[
        `z-${elevation}`,
        'items-center justify-center backdrop-blur-xs',
        'modal bg-base-300 fixed inset-0 flex flex-col',
      ]"
    >
      <div class="flex items-center justify-center p-4"><slot /></div>
    </div>
  </teleport>
</template>
