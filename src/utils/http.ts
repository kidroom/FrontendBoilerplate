import axios, { type AxiosError } from 'axios'
import { toast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const token = auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    if (status === 401) {
      const auth = useAuthStore()
      auth.clearSession()
      window.location.assign(`${import.meta.env.BASE_URL}login`)
      return Promise.reject(error)
    }
    if (status === 403) {
      toast.error('沒有權限執行此操作')
    } else if (status !== undefined && status >= 500) {
      toast.error('伺服器發生錯誤，請稍後再試')
    }
    return Promise.reject(error)
  },
)
