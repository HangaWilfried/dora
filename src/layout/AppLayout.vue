<script setup lang="ts">
import RoleMenu from '@/layout/components/RoleMenu.vue'
import MainHeader from '@/layout/components/MainHeader.vue'
import ChildrenRoutes from '@/layout/components/ChildrenRoutes.vue'
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <MainHeader />
      <ChildrenRoutes />
    </div>
    <RoleMenu />
  </div>
</template>
