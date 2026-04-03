<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { useError } from '@/composables/useError'
import { AdminService } from '@/services/leavemanager'

import PageTitle from '@/components/PageTitle.vue'
import DoraLoading from '@/components/DoraLoading.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import DeleteEmployee from '@/components/DeleteEmployee.vue'
import ViewEmployeeDetails from '@/components/ViewEmployeeDetails.vue'
import CreateEmployeeRequest from '@/components/CreateEmployeeRequest.vue'
import { useAuth } from '@/plugins/useAuth.ts'

const { t } = useI18n({
  messages: {
    en: {
      delete: 'Delete',
      title: 'Employees',
      empty: 'No employees found',
      description: 'Manage company employees',
      search: 'Search for an employee...',
      table: {
        name: 'Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        actions: 'Actions',
      },
      role: {
        SUPER_ADMIN: 'RH',
        ADMIN: 'Manager',
        EMPLOYEE: 'Employee',
      },
      status: {
        active: 'Active',
        inactive: 'Inactive',
      },
    },
    fr: {
      delete: 'Supprimer',
      title: 'Employés',
      empty: 'Aucun employé créé',
      description: "Gérez les employés de l'entreprise",
      search: 'Rechercher un employé...',
      table: {
        name: 'Nom',
        email: 'Email',
        role: 'Rôle',
        status: 'Statut',
        actions: 'Actions',
      },
      role: {
        SUPER_ADMIN: 'RH',
        ADMIN: 'Manager',
        EMPLOYEE: 'Employé',
      },
      status: {
        active: 'Actif',
        inactive: 'Inactif',
      },
    },
  },
})

const search = ref('')
const { hasRole } = useAuth()
const isCurrentUserAdminMember = computed(() => hasRole(['ADMIN', 'SUPER_ADMIN']))

const { isRequestFailed, getErrorMessage, setError } = useError()

const {
  data: employees,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await AdminService.getAllEmployees()
    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }
    return response.data
  },
})

const filteredEmployees = computed(() => {
  if (!employees.value) return []
  const q = search.value.toLowerCase()
  if (!q) return employees.value
  return employees.value.filter(
    (e) =>
      e.firstname?.toLowerCase().includes(q) ||
      e.lastname?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q),
  )
})
</script>

<template>
  <BaseContainer>
    <div class="flex items-center justify-between">
      <PageTitle>
        <h1 class="font-medium">{{ t('title') }}</h1>
        <span class="text-xs">{{ t('description') }}</span>
      </PageTitle>
      <CreateEmployeeRequest />
    </div>

    <DoraLoading v-if="isLoading || isFetching" />

    <template v-else>
      <div class="mb-4">
        <input
          v-model="search"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('search')"
        />
      </div>

      <div v-if="filteredEmployees.length" class="card overflow-x-auto">
        <table class="table w-full text-sm">
          <thead>
            <tr class="text-secondary-content text-xs">
              <th class="font-medium">{{ t('table.name') }}</th>
              <th class="font-medium">{{ t('table.email') }}</th>
              <th class="font-medium">{{ t('table.role') }}</th>
              <!--              <th class="font-medium">{{ t('table.status') }}</th>-->
              <th v-if="isCurrentUserAdminMember" class="text-right font-medium">
                {{ t('table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="employee in filteredEmployees"
              :key="employee.id"
              class="border-secondary-content/10 border-b last:border-0"
            >
              <td class="font-medium">{{ employee.firstname }} {{ employee.lastname }}</td>
              <td class="text-secondary-content">{{ employee.email }}</td>
              <td class="text-secondary-content">{{ t(`role.${employee.role}`) }}</td>
              <!--              <td>-->
              <!--                <span-->
              <!--                  :class="[-->
              <!--                    'rounded-lg px-2 py-1 text-xs font-medium',-->
              <!--                    employee.isActivated-->
              <!--                      ? 'bg-success/10 text-success'-->
              <!--                      : 'bg-neutral text-base-content/40',-->
              <!--                  ]"-->
              <!--                >-->
              <!--                  {{ employee.isActivated ? t('status.active') : t('status.inactive') }}-->
              <!--                </span>-->
              <!--              </td>-->
              <td v-if="isCurrentUserAdminMember">
                <span class="flex items-center justify-end gap-2">
                  <ViewEmployeeDetails :employee="employee" />
                  <DeleteEmployee :employee="employee" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <span v-else class="font-italic text-sm">{{ t('empty') }}</span>
    </template>
  </BaseContainer>
</template>
