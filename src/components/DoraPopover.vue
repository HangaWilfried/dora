<script setup lang="ts">
const { triggerClass = 'btn m-1' } = defineProps<{ triggerClass?: string }>()
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" :class="triggerClass">
      <slot name="trigger" />
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      <slot />
    </ul>
  </div>
</template>
