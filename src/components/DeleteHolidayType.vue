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

const { holidayTypeId } = defineProps<{ holidayTypeId?: number }>()

const { t } = useI18n({
  messages: {
    en: {
      tooltip: 'Delete',
      modal: {
        title: 'You are about to delete a leave type',
        description:
          'This action is permanent. The leave type will be permanently deleted from the system.',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      toast: {
        success: 'The leave type has been deleted',
      },
    },
    fr: {
      tooltip: 'Supprimer',
      modal: {
        title: 'Vous êtes sur le point de supprimer un type de congé',
        description:
          'Cette action est irréversible. Le type de congé sera définitivement supprimé du système.',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      toast: {
        success: 'Le type de congé a été supprimé',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: deleteHolidayType, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayTypeId) {
      throw new Error('Missing holiday type id')
    }

    const response = await HolidayService.deleteHolidayTypeById({ path: { holidayTypeId } })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
    queryClient.invalidateQueries({ queryKey: ['holidayTypes'] })
  },
})
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-outline btn-error">
        <Trash2 class="size-5 stroke-2" />
        <span>{{ t('tooltip') }}</span>
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
        <ButtonWrapper @click="deleteHolidayType" :is-loading="isPending" class="btn-error px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
