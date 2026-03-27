<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Pencil } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { toTypedSchema, useForm, yup } from '@/plugins/validator.ts'
import { HolidayService, type HolidayTypeDTO } from '@/services/leavemanager'

import TextInput from '@/components/TextInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import TextareaInput from '@/components/TextareaInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { holidayType } = defineProps<{ holidayType: HolidayTypeDTO }>()

const queryClient = useQueryClient()

const { t } = useI18n({
  messages: {
    en: {
      modify: 'Modify',
      toast: {
        success: 'This leave type has been edited',
      },
      modal: {
        field: {
          name: {
            label: 'Name',
            placeholder: 'Eg: annual leave',
          },
          description: 'Description',
        },
        title: 'Leave type edition',
        btn: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
    fr: {
      modify: 'Modifier',
      toast: {
        success: 'Ce type de congé a été modifié',
      },
      modal: {
        field: {
          name: {
            label: 'Nom',
            placeholder: 'EX: congé annuel',
          },
          description: 'Description',
        },
        title: 'Edition du type de congé',
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

const { handleSubmit } = useForm<HolidayTypePayload>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: holidayType.name,
    description: holidayType.description,
  },
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: HolidayTypePayload) => {
    const response = await HolidayService.updateHolidayType({
      path: { holidayTypeId: holidayType.id as number },
      body: payload,
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
    queryClient.invalidateQueries({ queryKey: [holidayType.id, 'holidayType'] })
  },
})

const updateLeaveType = handleSubmit((values) => mutate(values))
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-outline">
        <Pencil class="size-5 stroke-2" />
        <span>{{ t('modify') }}</span>
      </ButtonWrapper>
    </template>
    <template #default>
      <form @submit="updateLeaveType" class="divide-secondary-content/40 flex flex-col divide-y">
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
