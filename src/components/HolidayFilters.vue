<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search } from 'lucide-vue-next'
import SelectInput from '@/components/SelectInput.vue'

const { t, locale } = useI18n({
  messages: {
    fr: {
      search: 'Rechercher...',
      ALL: 'Tous les status',
      DRAFT: 'Brouillon',
      PUBLISH: 'Publié',
      APPROVED: 'Approuvé',
      VALIDATED: 'Validé',
      REFUSED: 'Refusé',
      IN_PROGRESS: 'En cours',
      PASSED: 'Terminé',
    },
    en: {
      search: 'Search...',
      ALL: 'All status',
      DRAFT: 'Draft',
      PUBLISH: 'Published',
      APPROVED: 'Approved',
      VALIDATED: 'Validated',
      REFUSED: 'Refused',
      IN_PROGRESS: 'In progress',
      PASSED: 'Completed',
    },
  },
})

const statuses = computed(() => {
  console.log(locale.value)

  return [
    {
      label: t('ALL'),
      value: null,
    },
    {
      label: t('holidayStatus.DRAFT'),
      value: 'DRAFT',
    },
    {
      label: t('holidayStatus.PUBLISH'),
      value: 'PUBLISH',
    },
    {
      label: t('holidayStatus.APPROVED'),
      value: 'APPROVED',
    },
    {
      label: t('holidayStatus.VALIDATED'),
      value: 'VALIDATED',
    },
    {
      label: t('holidayStatus.REFUSED'),
      value: 'REFUSED',
    },
    {
      label: t('holidayStatus.IN_PROGRESS'),
      value: 'IN_PROGRESS',
    },
    {
      label: t('holidayStatus.PASSED'),
      value: 'PASSED',
    },
  ]
})

const searchCriteria = defineModel({
  default: {
    queryString: '',
    status: '',
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <label class="input grow">
      <Search class="h-[1em] opacity-50" />
      <input
        class="grow"
        type="search"
        :placeholder="t('search')"
        v-model="searchCriteria.queryString"
      />
    </label>
    <SelectInput v-model="searchCriteria.status" name="status" :options="statuses" />
  </div>
</template>
