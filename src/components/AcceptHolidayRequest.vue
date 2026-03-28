<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from 'lucide-vue-next'
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
      tooltip: 'Approve',
      modal: {
        title: 'You are about to approve a leave request',
        description:
          'This action will approve the leave request. The employee will be notified and the request will be marked as approved.',
        cancel: 'Cancel',
        confirm: 'Approve',
      },
      toast: {
        success: 'The leave request has been approved',
      },
    },
    fr: {
      tooltip: 'Approuver',
      modal: {
        title: "Vous êtes sur le point d'approuver une demande de congé",
        description:
          'Cette action approuvera la demande de congé. L’employé sera notifié et la demande sera marquée comme approuvée.',
        cancel: 'Annuler',
        confirm: 'Approuver',
      },
      toast: {
        success: 'La demande de congé a été approuvée',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: acceptHolidayRequest, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayId) {
      throw new Error('Missing holiday id')
    }

    const response = await HolidayService.approvedHoliday({ path: { holidayId } })

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
      <ButtonWrapper
        class="btn-xs btn-square btn-success btn-ghost tooltip"
        :data-tip="t('tooltip')"
      >
        <Check class="size-5 stroke-2" />
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
        <ButtonWrapper
          @click="acceptHolidayRequest"
          :is-loading="isPending"
          class="btn-success px-8"
        >
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
