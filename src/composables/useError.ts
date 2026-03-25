import { useI18n } from 'vue-i18n'
import { useSessionStore } from '@/stores/session.ts'

type Exception = {
  status?: number
  error: unknown
}

export const useError = () => {
  const session = useSessionStore()
  const { t } = useI18n({
    useScope: 'global',
    inheritLocale: true,
    messages: {
      en: {
        errors: {
          unauthorized: 'You are not authorized.',
          conflict: 'A conflict occurred.',
          notFound: 'Resource not found.',
          unauthorizedAction: 'Access forbidden.',
          unknownError: 'An unknown error occurred.',
        },
      },
      fr: {
        errors: {
          unauthorized: 'Vous devez vous connecter.',
          conflict: 'Un conflit est survenu.',
          notFound: 'Ressource introuvable.',
          unauthorizedAction: 'Accès interdit.',
          unknownError: 'Une erreur inconnue est survenue.',
        },
      },
    },
  })

  const errorMap: Record<number, string> = {
    401: 'errors.unauthorized',
    403: 'errors.unauthorizedAction',
    404: 'errors.notFound',
    409: 'errors.conflict',
  }

  const getErrorMessage = (exception: Exception) => {
    if (exception.error) {
      if (typeof exception.error === 'string') {
        return exception.error
      }

      return Object.values(exception.error).filter(Boolean)[0] ?? t('errors.unknownError')
    }
    if (exception.status) return t(errorMap[exception.status] || 'errors.unknownError')
    return t('errors.unknownError')
  }

  const isRequestFailed = ({ status, error }: Exception): boolean => {
    if (error != null) return true

    if (typeof status !== 'number') return true

    return status < 200 || status >= 300
  }

  const setError = (exception: Exception): void => {
    session.openErrorModal({
      openModal: true,
      status: exception.status,
      message: getErrorMessage(exception),
    })
  }

  return {
    setError,
    getErrorMessage,
    isRequestFailed,
  }
}
