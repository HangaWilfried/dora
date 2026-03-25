import type { ApiError } from '@/utils/types'
import { QueryCache, MutationCache, QueryClient } from '@tanstack/vue-query'

import { push as toast, createNotivue } from 'notivue'
import 'notivue/notification.css'
import 'notivue/animations.css'

function notifyError(error: string | ApiError) {
  if (typeof error === 'object') {
    toast.error(error.message as string)
  } else {
    toast.error(error)
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: notifyError,
  }),
  mutationCache: new MutationCache({
    onError: notifyError,
  }),
})

const toastProvider = createNotivue()

export { toast, toastProvider, queryClient }
