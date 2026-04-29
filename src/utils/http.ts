import axios, { type AxiosError } from 'axios'
import { toast } from '@/composables/useToast'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

/** Vite 只會注入有定義的 VITE_*；未設定或空字串時使用相對路徑後備。 */
function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed.length > 0) return trimmed
  }
  return '/api'
}

export const http = axios.create({
  baseURL: resolveApiBaseUrl(),
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
      const current = router.currentRoute.value
      if (current.name === 'login') {
        void router.replace({ name: 'login' }).catch(() => {})
      } else {
        void router.replace({ name: 'login', query: { redirect: current.fullPath } }).catch(() => {})
      }
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
