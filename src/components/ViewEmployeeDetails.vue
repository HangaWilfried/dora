<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { AlertDialogCancel } from 'reka-ui'
import { Ellipsis, Copy, Check } from 'lucide-vue-next'

import { useForm } from '@/plugins/validator.ts'
import { type EmployeeDTO } from '@/services/leavemanager'

import TextInput from '@/components/TextInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import AlertDialog from '@/components/AlertDialog.vue'
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
          copy: 'Copy credentials',
          copied: 'Copied!',
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
          copy: 'Copier les identifiants',
          copied: 'Copié !',
        },
      },
    },
  },
})

useForm({
  initialValues: {
    role: employee.role,
    email: employee.email,
    password: employee.password,
    lastname: employee.lastname,
    firstname: employee.firstname,
  },
})

const roles = computed(() => {
  return [
    { label: t('role.MANAGER'), value: 'ADMIN' },
    { label: t('role.EMPLOYEE'), value: 'EMPLOYEE' },
  ]
})

const copied = ref(false)

async function copyCredentials() {
  const text = `Email: ${employee.email}\nPassword: ${employee.password}`
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <AlertDialog>
    <template #trigger>
      <ButtonWrapper class="btn-ghost btn-square btn-sm tooltip" :data-tip="t('tooltip')">
        <Ellipsis class="text-secondary/40 size-4 stroke-2" />
      </ButtonWrapper>
    </template>
    <template #default>
      <form class="space-y-5 p-4">
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
          <TextInput
            name="password"
            :disabled="true"
            :label="t('modal.field.password.label')"
            :placeholder="t('modal.field.password.placeholder')"
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
          <ButtonWrapper type="button" class="btn-outline gap-2" @click="copyCredentials">
            <Check v-if="copied" class="size-4" />
            <Copy v-else class="size-4" />
            {{ copied ? t('modal.btn.copied') : t('modal.btn.copy') }}
          </ButtonWrapper>
          <AlertDialogCancel class="btn btn-outline px-8">
            {{ t('modal.btn.cancel') }}
          </AlertDialogCancel>
        </div>
      </form>
    </template>
  </AlertDialog>
</template>
