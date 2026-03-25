<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQuery } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { HolidayService } from '@/services/leavemanager'
import { toTypedSchema, useForm, yup } from '@/plugins/validator.ts'

import TextInput from '@/components/TextInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import SelectInput from '@/components/SelectInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'
import TextareaInput from '@/components/TextareaInput.vue'
import { ref } from 'vue'

const { t } = useI18n({
  messages: {
    en: {
      new: 'New',
      toast: {
        success: 'Your leave request has been created',
      },
      modal: {
        field: {
          title: 'Title',
          type: {
            label: 'Leave type',
            placeholder: 'Choose a leave type',
          },
          startDate: 'Start date',
          endDate: 'End date',
          description: 'Description',
        },
        title: 'New leave request',
        btn: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
    fr: {
      new: 'Nouveau',
      toast: {
        success: 'Votre demande de congé a été crée',
      },
      modal: {
        field: {
          title: 'Titre',
          type: {
            label: 'Type de congé',
            placeholder: 'Choisir un type de congé',
          },
          startDate: 'Date de début',
          endDate: 'Date de fin',
          description: 'Description',
        },
        title: 'Nouvelle demande de congé',
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
  title: yup.string().required('required_lbl'),
  type: yup.number().required('required_lbl'),
  description: yup.string().optional(),
  period: yup.object({
    startDate: yup.string().required('required_lbl'),
    endDate: yup.string().required('required_lbl'),
  }),
})

type HolidayPayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const {
  isFetching,
  isLoading,
  data: holidayTypes,
} = useQuery({
  queryKey: ['holidayTypes'],
  queryFn: async () => {
    const response = await HolidayService.getAllHolidayTypes()

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  select(types) {
    return types?.map((type) => ({
      value: type.id,
      label: `${type.name} - (${type.description})`,
    }))
  },
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: HolidayPayload) => {
    const response = await HolidayService.createHoliday({ body: payload })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
  },
})

const submitLeaveRequest = handleSubmit((values) => mutate(values))
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
      <form @submit="submitLeaveRequest" class="divide-secondary-content/40 flex flex-col divide-y">
        <h1 class="px-6 py-4 text-sm font-medium">{{ t('modal.title') }}</h1>
        <div class="flex flex-col gap-2 px-6 py-4">
          <TextInput name="title" :label="t('modal.field.title')" />
          <SelectInput
            name="type"
            :options="holidayTypes"
            :label="t('modal.field.type.label')"
            :is-loading="isFetching || isLoading"
            :placeholder="t('modal.field.type.placeholder')"
          />
          <div class="grid grid-cols-2 gap-4">
            <TextInput name="period.startDate" :label="t('modal.field.startDate')" type="date" />
            <TextInput name="period.endDate" :label="t('modal.field.endDate')" type="date" />
          </div>
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
