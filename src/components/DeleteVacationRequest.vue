<script setup lang="ts">
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
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
      tooltip: 'Delete',
      modal: {
        title: 'You are about to delete your leave request',
        description:
          'This action is permanent. Your leave request will be permanently deleted from the system.',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      toast: {
        success: 'Your leave request has been deleted',
      },
    },
    fr: {
      tooltip: 'Supprimer',
      modal: {
        title: 'Vous êtes sur le point de supprimer votre demande de congé',
        description:
          'Cette action est irréversible. Votre demande de congé sera définitivement supprimée du système.',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      toast: {
        success: 'Votre demande de congé a été supprimée',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: deleteHoliday, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayId) {
      throw new Error('Missing holiday id')
    }

    const response = await HolidayService.deleteHolidayById({ path: { holidayId } })

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
        class="btn-square btn-xs btn-error btn-outline tooltip"
        :data-tip="t('tooltip')"
      >
        <Trash2 class="text-error size-4 stroke-2" />
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
        <ButtonWrapper @click="deleteHoliday" :is-loading="isPending" class="btn-error px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
