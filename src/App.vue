<script setup lang="ts">
import AppToaster from '@/components/AppToaster.vue'
import HttpErrorModal from '@/components/HttpErrorModal.vue'
</script>

<template>
  <app-toaster />
  <http-error-modal />
  <router-view />
</template>
