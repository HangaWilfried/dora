import { client as LeaveManagerClient } from '@/services/leavemanager/client.gen'

let token: string | undefined = undefined
const baseURL = import.meta.env.VITE_REST_API_BASE_URL

LeaveManagerClient.instance.interceptors.request.use((config) => {
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  config.baseURL = baseURL
  return config
})

export const setClientToken = (newToken?: string) => {
  token = newToken
}
