<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>Holiday type id: {{ route.params.id }}</div>
</template>
