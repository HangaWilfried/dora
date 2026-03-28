<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'

import AlertDialog from '@/components/AlertDialog.vue'
import { HolidayService } from '@/services/leavemanager'
import ButtonWrapper from '@/components/ButtonWrapper.vue'
import { useI18n } from 'vue-i18n'

const { holidayId } = defineProps<{ holidayId?: number }>()

const { t } = useI18n({
  messages: {
    en: {
      tooltip: 'Submit',
      modal: {
        title: 'You are about to submit your leave request',
        description:
          'By proceeding, your department manager will review your request and keep you informed of the next steps.',
        cancel: 'Cancel',
        confirm: 'Continue',
      },
      toast: {
        success: 'Your leave request has been submitted',
      },
    },
    fr: {
      tooltip: 'Soumettre',
      modal: {
        title: 'Vous êtes sur le point de soumettre votre demande de congé',
        description:
          'En poursuivant, le responsable de votre département prendra connaissance de votre demande et vous tiendra informé de la suite.',
        cancel: 'Annuler',
        confirm: 'Continuer',
      },
      toast: {
        success: 'Votre demande de congé a été soumise',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: publishHoliday, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayId) {
      throw new Error('Missing holiday id')
    }

    const response = await HolidayService.publishHoliday({ path: { holidayId } })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
    queryClient.invalidateQueries({ queryKey: ['my-vacations'] })
  },
})
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper
        class="btn-square btn-xs btn-success btn-outline tooltip"
        :data-tip="t('tooltip')"
      >
        <Send class="text-success size-5 stroke-2" />
      </ButtonWrapper>
    </template>
    <div class="flex flex-col gap-4 p-6">
      <div class="flex flex-col gap-0.5">
        <h1 class="text-sm font-medium">{{ t('modal.title') }}</h1>
        <span class="text-xs">{{ t('modal.description') }}</span>
      </div>
      <div class="mt-2 flex items-center justify-end gap-2">
        <AlertDialogCancel class="btn btn-outline px-8">
          {{ t('modal.cancel') }}
        </AlertDialogCancel>
        <ButtonWrapper @click="publishHoliday" :is-loading="isPending" class="btn-primary px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
