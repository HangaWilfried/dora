<script setup lang="ts">
import { useField } from 'vee-validate'
import FieldError from '@/components/FieldError.vue'

const { name, type = 'text' } = defineProps<{
  name: string
  label: string
  placeholder?: string
  type?: 'number' | 'password' | 'email' | 'text' | 'date'
}>()

const { value, errorMessage } = useField(() => name, undefined, { syncVModel: true })
</script>

<template>
  <div class="fieldset">
    <label :for="name" class="fieldset-label">{{ label }}</label>
    <input
      :type="type"
      v-model="value"
      :id="name"
      :name="name"
      :placeholder="placeholder"
      class="input w-full"
    />
    <FieldError :error="errorMessage" />
  </div>
</template>
