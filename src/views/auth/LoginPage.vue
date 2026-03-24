<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'

import { toast } from '@/plugins/toast.ts'
import { useAuth } from '@/plugins/useAuth'
import { useError } from '@/composables/useError'
import { AuthenticationService } from '@/services/leavemanager'
import { useForm, toTypedSchema, yup } from '@/plugins/validator'

import AppLogo from '@/components/AppLogo.vue'
import TextInput from '@/components/TextInput.vue'
import ButtonWrapper from '@/components/ButtonWrapper.vue'

const router = useRouter()
const { setToken } = useAuth()
const { isRequestFailed, getErrorMessage, setError } = useError()

const { t } = useI18n({
  useScope: 'global',
  inheritLocale: true,
  messages: {
    en: {
      email: {
        field: 'Email',
        placeholder: "name{'@'}enterprise.com",
      },
      password: {
        field: 'Password',
        placeholder: '..........',
      },
      login: {
        cta: 'Login',
        success: 'Login successful',
      },
    },
    fr: {
      email: {
        field: 'Adresse email',
        placeholder: "nom{'@'}entreprise.com",
      },
      password: {
        field: 'Mot de passe',
        placeholder: '..........',
      },
      login: {
        cta: 'Se connecter',
        success: 'Connexion reussie',
      },
    },
  },
})

const schema = yup.object({
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'invalid_email_lbl')
    .required('required_lbl'),
  password: yup.string().required('required_lbl'),
})

type LoginPayload = yup.InferType<typeof schema>

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { mutate, isPending } = useMutation({
  mutationFn: async (payload: LoginPayload) => {
    const response = await AuthenticationService.authenticate({
      body: payload,
    })

    if (isRequestFailed(response)) {
      setError(response)
      throw getErrorMessage(response)
    }

    return response.data
  },
  onSuccess: (response) => {
    setToken(response?.value)
    router.push('/').then(() => {
      toast.success(t('login.success'))
    })
  },
})

const performLogin = handleSubmit((values) => mutate(values))
</script>

<template>
  <section class="min-h-dvh w-dvw p-4 pt-10 lg:pt-20">
    <div class="m-auto flex w-full max-w-md flex-col items-center gap-4">
      <AppLogo direction="column" />
      <form
        autocomplete="off"
        @submit="performLogin"
        class="card border-secondary-content/15 bg-base-300 flex w-full flex-col gap-4 border p-5"
      >
        <TextInput name="email" :label="t('email.field')" :placeholder="t('email.placeholder')" />
        <TextInput
          type="password"
          name="password"
          :label="t('password.field')"
          :placeholder="t('password.placeholder')"
        />
        <ButtonWrapper :is-loading="isPending" type="submit" class="btn-primary">
          {{ t('login.cta') }}
        </ButtonWrapper>
      </form>
    </div>
  </section>
</template>
