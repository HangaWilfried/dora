<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ error?: string }>()

const { t } = useI18n({
  messages: {
    en: {
      required_lbl: 'This field is required',
      invalid_email_lbl: 'Please enter a valid email',
    },
    fr: {
      required_lbl: 'Ce champ est obligatoire',
      invalid_email_lbl: 'Veuillez entrer une adresse email valide',
    },
  },
})
</script>

<template>
  <span v-if="error" class="text-error text-xs">{{ t(error) }}</span>
</template>
