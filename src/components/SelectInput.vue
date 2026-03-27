<script setup lang="ts">
import { useField } from 'vee-validate'
import FieldError from '@/components/FieldError.vue'
import DoraLoading from '@/components/DoraLoading.vue'

const { name, options = [] } = defineProps<{
  name: string
  label?: string
  isLoading?: boolean
  placeholder?: string
  modelValue?: unknown
  options?: Array<{ value: unknown; label: string }>
}>()

const { value, errorMessage } = useField(() => name, undefined, { syncVModel: true })
</script>

<template>
  <div class="fieldset">
    <label v-if="label" :for="name" class="fieldset-label">
      <DoraLoading v-if="isLoading" class="loading-xs" />
      {{ label }}
    </label>
    <select
      :id="name"
      :name="name"
      v-model="value"
      :disabled="isLoading"
      class="select disabled:bg-secondary w-full"
    >
      <option selected disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.label" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <FieldError :error="errorMessage" />
  </div>
</template>
