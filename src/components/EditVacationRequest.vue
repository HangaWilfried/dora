<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { toTypedSchema, useForm, yup } from '@/plugins/validator.ts'
import { type HolidayDTO, HolidayService } from '@/services/leavemanager'

import TextInput from '@/components/TextInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import SelectInput from '@/components/SelectInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'
import TextareaInput from '@/components/TextareaInput.vue'

const { holiday } = defineProps<{ holiday: HolidayDTO }>()

const { t } = useI18n({
  messages: {
    en: {
      tooltip: 'Edit',
      toast: {
        success: 'Your leave request has been modified',
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
      tooltip: 'Modifier',
      toast: {
        success: 'Votre demande de congé a été modifié',
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

const queryClient = useQueryClient()

const openModal = ref<boolean>(false)

const { isRequestFailed, getErrorMessage, setError } = useError()

const schema = yup.object({
  description: yup.string().optional(),
  title: yup.string().required('required_lbl'),
  period: yup.object({
    startDate: yup.string().required('required_lbl'),
    endDate: yup.string().required('required_lbl'),
  }),
  type: yup
    .object({
      id: yup.number().optional(),
      name: yup.string().optional(),
      description: yup.string().optional(),
    })
    .optional(),
})

type HolidayPayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm<HolidayPayload>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    type: holiday.type,
    title: holiday.title,
    period: holiday.period,
    description: holiday.description,
  },
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
      value: type,
      label: `${type.name} - (${type.description})`,
    }))
  },
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: HolidayPayload) => {
    const response = await HolidayService.updateHoliday({
      path: { holidayId: holiday.id as number },
      body: {
        ...holiday,
        ...payload,
        type: payload.type,
      },
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
    queryClient.invalidateQueries({ queryKey: ['my-vacations'] })
  },
})

const editLeaveRequest = handleSubmit((values) => mutate(values))
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-square btn-ghost tooltip" :data-tip="t('tooltip')">
        <Pencil class="size-5 stroke-2" />
      </ButtonWrapper>
    </template>
    <template #default>
      <form @submit="editLeaveRequest" class="divide-secondary-content/40 flex flex-col divide-y">
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
