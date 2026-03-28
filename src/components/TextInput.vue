<script setup lang="ts">
import { useField } from 'vee-validate'
import FieldError from '@/components/FieldError.vue'

const { name, type = 'text' } = defineProps<{
  name: string
  label: string
  disabled?: boolean
  placeholder?: string
  modelValue?: unknown
  type?: 'number' | 'password' | 'email' | 'text' | 'date'
}>()

const { value, errorMessage } = useField(() => name, undefined, { syncVModel: true })
</script>

<template>
  <div class="fieldset">
    <label :for="name" class="fieldset-label">{{ label }}</label>
    <input
      :id="name"
      :name="name"
      :type="type"
      v-model="value"
      :disabled="disabled"
      :placeholder="placeholder"
      class="input disabled:bg-neutral disabled:border-secondary-content/20 w-full"
    />
    <FieldError :error="errorMessage" />
  </div>
</template>
