<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { HolidayConfigService } from '@/services/leavemanager'
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
        success: 'A new leave configuration has been created',
      },
      modal: {
        title: 'New configuration',
        field: {
          type: {
            label: 'Leave type',
            placeholder: 'Choose a leave type',
          },
          description: {
            label: 'Description',
            placeholder: 'Configuration description',
          },
          limit: {
            year: 'Times/year',
            minDays: 'Min days',
            maxDays: 'Max days',
          },
        },
        btn: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
    fr: {
      new: 'Ajouter',
      toast: {
        success: 'Une nouvelle configuration de congé a été créée',
      },
      modal: {
        title: 'Nouvelle configuration',
        field: {
          type: {
            label: 'Type de congé',
            placeholder: 'Choisir un type de congé',
          },
          description: {
            label: 'Description',
            placeholder: 'Description de la config',
          },
          limit: {
            year: 'Nb fois/an',
            minDays: 'Min jours',
            maxDays: 'Max jours',
          },
        },
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
  numberOfTime: yup.number().optional(),
  minimumOfDays: yup.number().optional(),
  maximumOfDays: yup.number().optional(),
  isActivate: yup.boolean().optional(),
  holidayTypeId: yup.number().optional(),
})

type HolidayConfigPayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: HolidayConfigPayload) => {
    const response = await HolidayConfigService.createHolidayConfig({ body: payload })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: () => {
    openModal.value = false
    toast.success(t('toast.success'))
    queryClient.invalidateQueries({ queryKey: ['holidayConfigs'] })
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
      <form
        @submit="createLeaveType"
        class="divide-secondary-content/40 relative flex flex-col divide-y"
      >
        <h1 class="px-6 py-4 text-sm font-medium">{{ t('modal.title') }}</h1>
        <div class="flex flex-col gap-2 px-6 py-4">
          <div class="absolute inset-0 -z-1 opacity-0">
            <TextInput
              name="holidayTypeId"
              :model-value="$route.params.id"
              :label="t('modal.field.type.label')"
              :placeholder="t('modal.field.type.placeholder')"
            />
          </div>
          <TextareaInput name="description" :label="t('modal.field.description')" />
          <div class="grid grid-cols-3 gap-4">
            <TextInput placeholder="1" name="numberOfTime" :label="t('modal.field.limit.year')" />
            <TextInput
              placeholder="4"
              name="minimumOfDays"
              :label="t('modal.field.limit.minDays')"
            />
            <TextInput
              placeholder="7"
              name="maximumOfDays"
              :label="t('modal.field.limit.maxDays')"
            />
          </div>
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
