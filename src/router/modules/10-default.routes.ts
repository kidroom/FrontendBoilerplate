import type { RouteRecordRaw } from 'vue-router'

/** 公開頁、錯誤頁（萬用路由請見 `99-fallback.routes.ts`） */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false, title: '首頁' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false, title: '登入' },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/errors/ForbiddenView.vue'),
    meta: { requiresAuth: false, title: '無權限' },
  },
  {
    path: '/500',
    name: 'server-error',
    component: () => import('@/views/errors/ServerErrorView.vue'),
    meta: { requiresAuth: false, title: '伺服器錯誤' },
  },
]
