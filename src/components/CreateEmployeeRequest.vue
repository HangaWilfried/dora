<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Check, Copy, UserPlus } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useError } from '@/composables/useError.ts'
import { AdminService } from '@/services/leavemanager'
import { toTypedSchema, useForm, yup } from '@/plugins/validator.ts'

import TextInput from '@/components/TextInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const queryClient = useQueryClient()

const { t, locale } = useI18n({
  messages: {
    en: {
      role: {
        RH: 'RH',
        MANAGER: 'Manager',
        EMPLOYEE: 'Employee',
      },
      new: 'Add employee',
      toast: {
        success: 'Employee has been created successfully',
      },
      modal: {
        title: 'New employee',
        field: {
          role: {
            label: 'Role',
            placeholder: 'Ex: Employee',
          },
          firstname: {
            label: 'First name',
            placeholder: 'Eg: John',
          },
          lastname: {
            label: 'Last name',
            placeholder: 'Eg: Doe',
          },
          dateOfBirth: {
            label: 'Date of birth',
          },
        },
        btn: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
    },
    fr: {
      role: {
        RH: 'RH',
        MANAGER: 'Manager',
        EMPLOYEE: 'Employee',
      },
      new: 'Ajouter un employé',
      toast: {
        success: "L'employé a été créé avec succès",
      },
      modal: {
        title: 'Nouvel employé',
        field: {
          role: {
            label: 'Role',
            placeholder: 'Ex: Employee',
          },
          firstname: {
            label: 'Prénom',
            placeholder: 'Ex: Jean',
          },
          lastname: {
            label: 'Nom',
            placeholder: 'Ex: Dupont',
          },
          dateOfBirth: {
            label: 'Date de naissance',
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

const roles = computed(() => {
  console.log(locale.value)
  return [
    { label: t('role.MANAGER'), value: 'ADMIN' },
    { label: t('role.EMPLOYEE'), value: 'EMPLOYEE' },
  ]
})

const openModal = ref<boolean>(false)

const { isRequestFailed, getErrorMessage, setError } = useError()

const schema = yup.object({
  role: yup.string().required('required_lbl'),
  lastname: yup.string().required('required_lbl'),
  firstname: yup.string().required('required_lbl'),
  dateOfBirth: yup.string().required('required_lbl'),
})

type EmployeePayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: EmployeePayload) => {
    const response = await AdminService.createEmployee({ body: payload })

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

const createEmployee = handleSubmit((values) => mutate(values))
</script>

<template>
  <AlertDialog v-model:open="openModal">
    <template #trigger>
      <ButtonWrapper class="btn-primary">
        <UserPlus class="size-5 stroke-2" />
        <span>{{ t('new') }}</span>
      </ButtonWrapper>
    </template>
    <template #default>
      <form @submit="createEmployee" class="divide-secondary-content/40 flex flex-col divide-y">
        <h1 class="px-6 py-4 text-sm font-medium">{{ t('modal.title') }}</h1>
        <div class="grid grid-cols-2 gap-2 px-6 py-4">
          <TextInput
            name="lastname"
            :label="t('modal.field.lastname.label')"
            :placeholder="t('modal.field.lastname.placeholder')"
          />
          <TextInput
            name="firstname"
            :label="t('modal.field.firstname.label')"
            :placeholder="t('modal.field.firstname.placeholder')"
          />
          <TextInput
            name="email"
            :label="t('modal.field.email.label')"
            :placeholder="t('modal.field.email.placeholder')"
          />
          <SelectInput
            name="role"
            :options="roles"
            :label="t('modal.field.role.label')"
            :placeholder="t('modal.field.role.placeholder')"
          />
          <TextInput
            name="password"
            :label="t('modal.field.password.label')"
            :placeholder="t('modal.field.password.placeholder')"
          />
          <TextInput
            name="confirmPassword"
            :label="t('modal.field.confirmPassword.label')"
            :placeholder="t('modal.field.confirmPassword.placeholder')"
          />
        </div>
        <div class="mt-2 flex items-center justify-end gap-2 px-6 py-4">
          <AlertDialogCancel class="btn btn-outline px-8">
            {{ t('modal.btn.cancel') }}
          </AlertDialogCancel>
          <ButtonWrapper :is-loading="isPending" type="submit" class="btn-primary px-8">
            {{ t('modal.btn.save') }}
          </ButtonWrapper>
        </div>
      </form>
    </template>
  </AlertDialog>
</template>
