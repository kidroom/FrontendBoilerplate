import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

/** 各模組需 `export const routes: RouteRecordRaw[]`；檔名排序決定註冊順序（數字前綴建議：10-、20-、99-）。 */
const routeModules = import.meta.glob<{ routes: RouteRecordRaw[] }>('./modules/**/*.ts', {
  eager: true,
})

function buildRoutes(): RouteRecordRaw[] {
  const paths = Object.keys(routeModules).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
  )
  const merged: RouteRecordRaw[] = []
  for (const path of paths) {
    const mod = routeModules[path]
    const chunk = mod.routes
    if (Array.isArray(chunk)) merged.push(...chunk)
  }
  return merged
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: buildRoutes(),
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const permission = usePermissionStore()
  const isLoginRoute = to.name === 'login'

  if (!auth.isAuthenticated && !isLoginRoute) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (auth.isAuthenticated && isLoginRoute) {
    return { name: 'dashboard' }
  }

  const code = to.meta.permission
  if (typeof code === 'string' && code.length > 0 && !permission.has(code)) {
    return { name: 'forbidden' }
  }

  return true
})

export default router
