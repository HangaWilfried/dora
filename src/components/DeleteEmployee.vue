<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Trash2 } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { type EmployeeDTO, EmployeeService } from '@/services/leavemanager'

import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { employee } = defineProps<{ employee: EmployeeDTO }>()

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
  messages: {
    en: {
      tooltip: 'Delete',
      modal: {
        title: 'You are about to delete {employee}',
        description:
          'This action is permanent. This user will be permanently deleted from the system.',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      toast: {
        success: 'A user has been deleted',
      },
    },
    fr: {
      tooltip: 'Supprimer',
      modal: {
        title: 'Vous êtes sur le point de supprimer {employee}',
        description:
          'Cette action est irréversible. Cet utilisateur sera définitivement supprimé du système.',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      toast: {
        success: 'Un utilisateur a été supprimé',
      },
    },
  },
})

const queryClient = useQueryClient()
const openModal = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { mutate: deleteEmployee, isPending } = useMutation({
  mutationFn: async () => {
    const employeeId = employee.id as number
    const response = await EmployeeService.deleteEmployeeById({ path: { employeeId } })
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
    queryClient.invalidateQueries({ queryKey: ['employees'] })
  },
})
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-ghost btn-square btn-sm tooltip" :data-tip="t('delete')">
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
        <ButtonWrapper @click="deleteEmployee" :is-loading="isPending" class="btn-primary px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
