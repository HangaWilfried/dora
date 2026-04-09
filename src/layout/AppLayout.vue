<script setup lang="ts">
import RoleMenu from '@/layout/components/RoleMenu.vue'
import ChildrenRoutes from '@/layout/components/ChildrenRoutes.vue'
import LayoutHolidayCredits from '@/layout/components/LayoutHolidayCredits.vue'
</script>

<template>
  <div class="flex min-h-dvh">
    <RoleMenu />
    <div class="flex min-h-dvh min-w-0 flex-1 flex-col">
      <ChildrenRoutes />
      <LayoutHolidayCredits />
    </div>
  </div>
</template>
