<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { HolidayService } from '@/services/leavemanager'

import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { holidayId } = defineProps<{ holidayId?: number }>()

const { t } = useI18n({
  messages: {
    en: {
      tooltip: 'Reject',
      modal: {
        title: 'You are about to reject a leave request',
        description:
          'This action will reject the leave request. The employee will be notified and the request will be marked as refused.',
        cancel: 'Cancel',
        confirm: 'Reject',
      },
      toast: {
        success: 'The leave request has been rejected',
      },
    },
    fr: {
      tooltip: 'Refuser',
      modal: {
        title: 'Vous êtes sur le point de refuser une demande de congé',
        description:
          'Cette action rejettera la demande de congé. L’employé sera notifié et la demande sera marquée comme refusée.',
        cancel: 'Annuler',
        confirm: 'Refuser',
      },
      toast: {
        success: 'La demande de congé a été refusée',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: rejectHolidayRequest, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayId) {
      throw new Error('Missing holiday id')
    }

    const response = await HolidayService.rejectHoliday({ path: { holidayId } })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
    queryClient.invalidateQueries({ queryKey: ['allVacations'] })
  },
})
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-xs btn-square btn-error btn-ghost tooltip" :data-tip="t('tooltip')">
        <X class="size-5 stroke-2" />
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
        <ButtonWrapper @click="rejectHolidayRequest" :is-loading="isPending" class="btn-error px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
