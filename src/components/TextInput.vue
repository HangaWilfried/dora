<script setup lang="ts">
import { computed, ref } from 'vue'
import { useField } from 'vee-validate'
import { Eye, EyeClosed } from 'lucide-vue-next'
import FieldError from '@/components/FieldError.vue'

const { name, type = 'text' } = defineProps<{
  name: string
  label: string
  disabled?: boolean
  placeholder?: string
  modelValue?: unknown
  type?: 'number' | 'password' | 'email' | 'text' | 'date'
}>()

const isPasswordVisible = ref<boolean>(false)
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const isPasswordField = computed(() => type === 'password')
const actualInputType = computed(() => {
  if (isPasswordField.value && isPasswordVisible.value) {
    return 'text'
  }
  return type
})

const { value, errorMessage } = useField(() => name, undefined, { syncVModel: true })
</script>

<template>
  <div class="fieldset">
    <label :for="name" class="fieldset-label">{{ label }}</label>
    <div class="relative flex w-full">
      <input
        :id="name"
        :name="name"
        v-model="value"
        :disabled="disabled"
        :type="actualInputType"
        :placeholder="placeholder"
        class="input disabled:bg-neutral grow disabled:border-none"
      />
      <span
        v-if="isPasswordField"
        @click="togglePasswordVisibility"
        class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
      >
        <component
          :is="isPasswordVisible ? Eye : EyeClosed"
          class="size-4 transition-all duration-75 ease-in-out"
        />
      </span>
    </div>
    <FieldError :error="errorMessage" />
  </div>
</template>
