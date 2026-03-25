<script setup lang="ts">
import { useField } from 'vee-validate'
import FieldError from '@/components/FieldError.vue'

const { name } = defineProps<{
  name: string
  label: string
  placeholder?: string
}>()

const { value, errorMessage } = useField<string>(() => name, undefined, { syncVModel: true })
</script>

<template>
  <div class="fieldset">
    <label :for="name" class="fieldset-label">{{ label }}</label>
    <textarea
      :id="name"
      :name="name"
      v-model="value"
      :placeholder="placeholder"
      class="textarea h-20 w-full resize-none"
    ></textarea>
    <FieldError :error="errorMessage" />
  </div>
</template>
