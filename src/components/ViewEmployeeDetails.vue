<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Ellipsis } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'
import { useQuery } from '@tanstack/vue-query'

import { useForm } from '@/plugins/validator.ts'
import { useError } from '@/composables/useError.ts'
import { type EmployeeDTO, EmployeeService } from '@/services/leavemanager'

import TextInput from '@/components/TextInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import SelectInput from '@/components/SelectInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { employee } = defineProps<{ employee: EmployeeDTO }>()

const { t } = useI18n({
  messages: {
    en: {
      tooltip: 'overview',
      role: {
        RH: 'RH',
        MANAGER: 'Manager',
        EMPLOYEE: 'Employee',
      },
      modal: {
        field: {
          email: { label: 'Email', placeholder: 'Ex: [EMAIL_ADDRESS]' },
          password: { label: 'Password', placeholder: 'Ex: password' },
          role: { label: 'Role', placeholder: 'Ex: Employee' },
          firstname: { label: 'First name', placeholder: 'Eg: John' },
          lastname: { label: 'Last name', placeholder: 'Eg: Doe' },
        },
        btn: {
          cancel: 'Close',
        },
      },
    },
    fr: {
      tooltip: "vue d'ensemble",
      role: {
        RH: 'RH',
        MANAGER: 'Manager',
        EMPLOYEE: 'Employee',
      },
      modal: {
        title: 'Nouvel employé',
        field: {
          email: { label: 'Email', placeholder: 'Ex: [EMAIL_ADDRESS]' },
          password: { label: 'Password', placeholder: 'Ex: password' },
          role: { label: 'Role', placeholder: 'Ex: Employee' },
          firstname: { label: 'Prénom', placeholder: 'Ex: Jean' },
          lastname: { label: 'Nom', placeholder: 'Ex: Dupont' },
        },
        btn: {
          cancel: 'Fermer',
        },
      },
    },
  },
})

const { resetForm } = useForm({
  initialValues: {
    role: employee.role,
    email: employee.email,
    password: employee.password,
    lastname: employee.lastname,
    firstname: employee.firstname,
  },
})

const open = ref<boolean>(false)
const { isRequestFailed, getErrorMessage, setError } = useError()

const { isLoading, isFetching } = useQuery({
  queryKey: [employee.id, 'user-password'],
  queryFn: async ({ queryKey }) => {
    const employeeId = Number(queryKey[0])

    const response = await EmployeeService.getEmployeeById({
      path: { employeeId },
    })
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    const employeeDetails = response.data
    if (employeeDetails) {
      resetForm({
        values: employeeDetails,
      })
    }
    return employeeDetails
  },
  enabled: computed(() => open.value),
})

const roles = computed(() => {
  return [
    { label: t('role.MANAGER'), value: 'ADMIN' },
    { label: t('role.EMPLOYEE'), value: 'EMPLOYEE' },
  ]
})
</script>

<template>
  <AlertDialog v-model:open="open">
    <template #trigger>
      <ButtonWrapper
        class="btn-outline btn-secondary btn-square btn-sm tooltip"
        :data-tip="t('tooltip')"
      >
        <Ellipsis class="text-secondary-content/60 size-4" />
      </ButtonWrapper>
    </template>
    <template #default>
      <DoraLoading v-if="isFetching || isLoading" />
      <form v-else class="space-y-5 p-4">
        <div class="grid grid-cols-2 items-center gap-2">
          <TextInput
            name="lastname"
            :disabled="true"
            :label="t('modal.field.lastname.label')"
            :placeholder="t('modal.field.lastname.placeholder')"
          />
          <TextInput
            name="firstname"
            :disabled="true"
            :label="t('modal.field.firstname.label')"
            :placeholder="t('modal.field.firstname.placeholder')"
          />
          <TextInput
            name="email"
            :disabled="true"
            :label="t('modal.field.email.label')"
            :placeholder="t('modal.field.email.placeholder')"
          />
          <SelectInput
            name="role"
            :options="roles"
            :disabled="true"
            :label="t('modal.field.role.label')"
            :placeholder="t('modal.field.role.placeholder')"
          />
        </div>
        <div class="flex items-center justify-end gap-2">
          <AlertDialogCancel class="btn btn-primary btn-outline px-8">
            {{ t('modal.btn.cancel') }}
          </AlertDialogCancel>
        </div>
      </form>
    </template>
  </AlertDialog>
</template>
