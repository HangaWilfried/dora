<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LogOut } from 'lucide-vue-next'
import { AlertDialogCancel } from 'reka-ui'

import { useAuth } from '@/plugins/useAuth.ts'

import AlertDialog from '@/components/AlertDialog.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const { t } = useI18n({
  messages: {
    en: {
      logout: 'Logout',
      modal: {
        title: 'You are about to log out',
        description: 'Are you sure you want to log out? You will be redirected to the login page.',
        cancel: 'Cancel',
        confirm: 'Log out',
      },
    },
    fr: {
      logout: 'Se déconnecter',
      modal: {
        title: 'Vous êtes sur le point de vous déconnecter',
        description:
          'Êtes-vous sûr de vouloir vous déconnecter ? Vous serez redirigé vers la page de connexion.',
        cancel: 'Annuler',
        confirm: 'Se déconnecter',
      },
    },
  },
})

const authState = useAuth()
</script>

<template>
  <AlertDialog>
    <template #trigger>
      <li>
        <button
          data-tip="Logout"
          :class="[
            'is-drawer-close:tooltip is-drawer-close:tooltip-right flex gap-2 py-3',
            'hover:bg-info/10 hover:text-error text-secondary-content items-center',
          ]"
        >
          <LogOut class="size-4" />
          <span class="is-drawer-close:hidden">{{ t('logout') }}</span>
        </button>
      </li>
    </template>
    <div class="flex flex-col gap-4 p-6">
      <div class="flex flex-col gap-0.5">
        <h1 class="text-sm font-medium">{{ t('modal.title') }}</h1>
        <span class="text-xs">{{ t('modal.description') }}</span>
      </div>
      <div class="mt-2 flex items-center justify-end gap-2">
        <AlertDialogCancel class="btn btn-outline px-8">
          {{ t('modal.cancel') }}
        </AlertDialogCancel>
        <ButtonWrapper @click="authState.logout" class="btn-primary px-8">
          {{ t('modal.confirm') }}
        </ButtonWrapper>
      </div>
    </div>
  </AlertDialog>
</template>
