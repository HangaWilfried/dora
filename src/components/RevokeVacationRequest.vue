<script setup lang="ts">
import { ref } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
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
      tooltip: 'Revoke',
      modal: {
        title: 'You are about to revoke your leave request',
        description: 'By proceeding, your department manager will no more see your request.',
        cancel: 'Cancel',
        confirm: 'Continue',
      },
      toast: {
        success: 'Your leave request has been revoked',
      },
    },
    fr: {
      tooltip: 'Révoquer',
      modal: {
        title: 'Vous êtes sur le point de révoquer votre demande de congé',
        description:
          'En poursuivant, le responsable de votre département ne verra plus votre demande.',
        cancel: 'Annuler',
        confirm: 'Continuer',
      },
      toast: {
        success: 'Votre demande de congé a été révoquée',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: unpublishHoliday, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayId) {
      throw new Error('Missing holiday id')
    }

    const response = await HolidayService.unpublishedHoliday({ path: { holidayId } })

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
        class="btn-square btn-xs btn-secondary text-secondary-content btn-outline tooltip p-0.5"
        :data-tip="t('tooltip')"
      >
        <RotateCcw class="size-5 stroke-2" />
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
        <ButtonWrapper @click="unpublishHoliday" :is-loading="isPending" class="btn-primary px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
