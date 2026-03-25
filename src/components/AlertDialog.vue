<script setup lang="ts">
import {
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogPortal,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogDescription,
} from 'reka-ui'

defineProps<{ isAlwaysOpen?: boolean }>()
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <AlertDialogRoot v-model:open="open" :default-open="isAlwaysOpen">
    <AlertDialogTrigger>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-30 bg-black/50" />
      <AlertDialogContent
        :class="[
          'bg-base-300 fixed top-[50%] left-[50%] z-100 max-h-[85vh] w-[90vw] max-w-125',
          'translate-x-[-50%] translate-y-[-50%] rounded-lg text-sm focus:outline-none',
          'shadow-[hsl(206_22%_7%/35%)_0px_10px_38px_-10px,hsl(206_22%_7%/20%)_0px_10px_20px_-15px]',
        ]"
      >
        <AlertDialogTitle class="sr-only" />
        <AlertDialogDescription class="sr-only" />
        <slot />
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
