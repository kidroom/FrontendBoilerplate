import type { RouteRecordRaw } from 'vue-router'

/** 必須置於最後：SPA 萬用路由 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFoundView.vue'),
    meta: { requiresAuth: false, title: '找不到頁面' },
  },
]
