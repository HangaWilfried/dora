import { ref } from 'vue'
import { defineStore } from 'pinia'

type ApiError = {
  message?: string
  status?: number
  openModal: boolean
}

export const useSessionStore = defineStore('session', () => {
  const error = ref<ApiError>({ openModal: false })

  const openErrorModal = (state: ApiError) => {
    error.value = {
      status: state.status,
      message: state.message,
      openModal: state.openModal,
    }
  }

  const closeErrorModal = () => {
    error.value = { openModal: false }
  }

  return {
    error,
    openErrorModal,
    closeErrorModal,
  }
})
