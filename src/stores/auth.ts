import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { RoleFunction } from '@/types/auth'

const TOKEN_KEY = 'crm_access_token'
const REFRESH_TOKEN_KEY = 'crm_refresh_token'
const ROLE_FUNCTIONS_KEY = 'crm_role_functions'

function readRoleFunctionsFromStorage(): RoleFunction[] {
  try {
    const raw = localStorage.getItem(ROLE_FUNCTIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as RoleFunction[]) : []
  } catch {
    return []
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const roleFunctions = ref<RoleFunction[]>(readRoleFunctionsFromStorage())

  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(value: string | null) {
    token.value = value
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  }

  function setRefreshToken(value: string | null) {
    refreshToken.value = value
    if (value) localStorage.setItem(REFRESH_TOKEN_KEY, value)
    else localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  function setSession(access: string, refresh: string | null) {
    setToken(access)
    setRefreshToken(refresh)
  }

  function setRoleFunctions(value: RoleFunction[]) {
    roleFunctions.value = value
    localStorage.setItem(ROLE_FUNCTIONS_KEY, JSON.stringify(value))
  }

  function clearSession() {
    setToken(null)
    setRefreshToken(null)
    roleFunctions.value = []
    localStorage.removeItem(ROLE_FUNCTIONS_KEY)
  }

  return {
    token,
    refreshToken,
    roleFunctions,
    isAuthenticated,
    setToken,
    setRefreshToken,
    setSession,
    setRoleFunctions,
    clearSession,
  }
})
