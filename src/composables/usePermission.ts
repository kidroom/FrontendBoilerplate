import { computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'

export function usePermission() {
  const permissionStore = usePermissionStore()

  function hasPermission(code: string): boolean {
    return permissionStore.has(code)
  }

  return {
    hasPermission,
    permissions: computed(() => permissionStore.permissions),
  }
}
