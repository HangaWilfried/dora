import { jwtDecode } from 'jwt-decode'
import { dayjs } from '@/plugins/date.ts'
import { setClientToken } from '@/plugins/clients.ts'

type JwtPayload = {
  exp?: number
  email?: string
  lastname?: string
  firstname?: string

  /*
  {
  "scopes": "SUPER_ADMIN",
  "sub": "admin@example.com",
  "iat": 1774693577,
  "exp": 1774915200
}
  * */
}

export const useAuth = () => {
  const setToken = (token?: string) => {
    setClientToken(token)
    localStorage.setItem('token', token ?? '')
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    setClientToken()
  }

  const getUserInfo = () => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwtDecode<JwtPayload>(token)

      return {
        ...user,
        isNull: false,
      }
    }

    return {
      isNull: true,
    }
  }

  const isAuthenticated = (): boolean => {
    const { isNull, exp } = getUserInfo()

    if (isNull) {
      return false
    }

    if (exp) {
      const isValid = dayjs().isBefore(dayjs(exp * 1000))

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
