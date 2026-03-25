<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { HolidayService } from '@/services/leavemanager'
import { toTypedSchema, useForm, yup } from '@/plugins/validator.ts'

import TextInput from '@/components/TextInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import TextareaInput from '@/components/TextareaInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const queryClient = useQueryClient()

const { t } = useI18n({
  messages: {
    en: {
      new: 'Add',
      toast: {
        success: 'Your leave type has been created',
      },
      modal: {
        field: {
          name: {
            label: 'Name',
            placeholder: 'Eg: annual leave',
          },
          description: 'Description',
        },
        title: 'New leave type',
        btn: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
    fr: {
      new: 'Ajouter',
      toast: {
        success: 'Votre type de congé a été crée',
      },
      modal: {
        field: {
          name: {
            label: 'Nom',
            placeholder: 'EX: congé annuel',
          },
          description: 'Description',
        },
        title: 'Nouveau type de congé',
        btn: {
          cancel: 'Annuler',
          save: 'Enregistrer',
        },
      },
    },
  },
})

const openModal = ref<boolean>(false)

const { isRequestFailed, getErrorMessage, setError } = useError()

const schema = yup.object({
  name: yup.string().required('required_lbl'),
  description: yup.string().optional(),
})

type HolidayTypePayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: HolidayTypePayload) => {
    const response = await HolidayService.createHolidayType({ body: payload })

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

const createLeaveType = handleSubmit((values) => mutate(values))
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-primary">
        <Plus class="size-5 stroke-2" />
        <span>{{ t('new') }}</span>
      </ButtonWrapper>
    </template>
    <template #default>
      <form @submit="createLeaveType" class="divide-secondary-content/40 flex flex-col divide-y">
        <h1 class="px-6 py-4 text-sm font-medium">{{ t('modal.title') }}</h1>
        <div class="flex flex-col gap-2 px-6 py-4">
          <TextInput
            name="name"
            :label="t('modal.field.name.label')"
            :placeholder="t('modal.field.name.placeholder')"
          />
          <TextareaInput name="description" :label="t('modal.field.description')" />
          <div class="mt-2 flex items-center justify-end gap-2">
            <AlertDialogCancel class="btn btn-outline px-8">
              {{ t('modal.btn.cancel') }}
            </AlertDialogCancel>
            <ButtonWrapper :is-loading="isPending" type="submit" class="btn-primary px-8">
              {{ t('modal.btn.save') }}
            </ButtonWrapper>
          </div>
        </div>
      </form>
    </template>
  </AlertDialog>
</template>
