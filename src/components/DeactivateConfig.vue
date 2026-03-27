<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertDialogCancel } from 'reka-ui'
import { ToggleRight } from 'lucide-vue-next'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { HolidayConfigService } from '@/services/leavemanager'

import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { holidayConfigId } = defineProps<{ holidayConfigId?: number }>()

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
  messages: {
    en: {
      tooltip: 'Deactivate',
      modal: {
        title: 'You are about to deactivate a leave type',
        description:
          'This action will deactivate the leave type. It will no longer be available for use, but can be reactivated later.',
        cancel: 'Cancel',
        confirm: 'Deactivate',
      },
      toast: {
        success: 'The leave type has been deactivated',
      },
    },
    fr: {
      tooltip: 'Désactiver',
      modal: {
        title: 'Vous êtes sur le point de désactiver un type de congé',
        description:
          'Cette action désactivera le type de congé. Il ne sera plus utilisable, mais pourra être réactivé ultérieurement.',
        cancel: 'Annuler',
        confirm: 'Désactiver',
      },
      toast: {
        success: 'Le type de congé a été désactivé',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: deactivateHolidayConfig, isPending } = useMutation({
  mutationFn: async () => {
    if (!holidayConfigId) {
      throw new Error('Missing holiday type id')
    }

    const response = await HolidayConfigService.deactivateHolidayConfig({
      path: { holidayConfigId },
    })

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
      <ButtonWrapper class="btn-square btn-ghost tooltip" :data-tip="t('tooltip')">
        <ToggleRight class="text-success size-5 stroke-2" />
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
          @click="deactivateHolidayConfig"
          :is-loading="isPending"
          class="btn-primary px-8"
        >
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
