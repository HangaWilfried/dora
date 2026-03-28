import { jwtDecode } from 'jwt-decode'
import { dayjs } from '@/plugins/date.ts'
import { setClientToken } from '@/plugins/clients.ts'

type JwtPayload = {
  scopes: string
  sub: string
  exp: number
}

type UserInfo =
  | {
      isNull: false
      exp: number
      email: string
      role: string
    }
  | { isNull: true }

export const useAuth = () => {
  const setToken = (token?: string) => {
    setClientToken(token)
    localStorage.setItem('token', token ?? '')
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    setClientToken()
  }

  const getUserInfo = (): UserInfo => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwtDecode<JwtPayload>(token)

      return {
        isNull: false,
        exp: user.exp,
        email: user.sub,
        role: user.scopes,
      }
    }

    return {
      isNull: true,
    }
  }

  const isAuthenticated = (): boolean => {
    const userInfo = getUserInfo()

    if (userInfo.isNull) {
      return false
    }

    if (userInfo.exp) {
      const isValid = dayjs().isBefore(dayjs(userInfo.exp * 1000))

      if (!isValid) {
        clearToken()
      }

      return isValid
    } else {
      clearToken()
      return false
    }
  }

  const initAuth = () => {
    const token = localStorage.getItem('token')
    if (token) {
      setClientToken(token)
    }
  }

  const logout = () => {
    clearToken()
    window.location.href = `${window.location.origin}/login`
  }

  return {
    logout,
    setToken,
    initAuth,
    clearToken,
    getUserInfo,
    isAuthenticated,
  }
}
