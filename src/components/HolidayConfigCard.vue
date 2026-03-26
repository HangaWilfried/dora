<script setup lang="ts">
import type { HolidayConfigDTO } from '@/services/leavemanager'

import ActivateConfig from '@/components/ActivateConfig.vue'
import DeactivateConfig from '@/components/DeactivateConfig.vue'

defineProps<{ holidayConfig: HolidayConfigDTO }>()
</script>

<template>
  <div class="text-secondary-content card flex flex-row items-start justify-between text-xs">
    <div class="flex flex-col gap-2">
      <h1 class="text-base-content text-sm font-medium">{{ holidayConfig.description }}</h1>
      <div class="flex items-center gap-8"></div>
    </div>
    <div class="flex items-center gap-2">
      <DeactivateConfig v-if="holidayConfig.isActivate" :holiday-config-id="holidayConfig.id" />
      <ActivateConfig v-else :holiday-config-id="holidayConfig.id" />
    </div>
  </div>
</template>
