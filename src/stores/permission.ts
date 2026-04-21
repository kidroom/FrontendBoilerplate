import { ref } from 'vue'
import { defineStore } from 'pinia'

const PERMISSIONS_KEY = 'permissions'

function readCodesFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export const usePermissionStore = defineStore('permission', () => {
  const permissions = ref<ReadonlySet<string>>(new Set(readCodesFromStorage()))

  function setPermissions(codes: string[]) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(codes))
    permissions.value = new Set(codes)
  }

  function has(code: string): boolean {
    return permissions.value.has(code)
  }

  return { permissions, setPermissions, has }
})
