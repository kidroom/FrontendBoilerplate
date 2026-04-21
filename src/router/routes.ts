import type { RouteRecordRaw } from 'vue-router'

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
  {
    path: '/app',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/app/DashboardView.vue'),
        meta: {
          title: '儀表板',
          description: '後台模板入口：由此前往各 Demo 頁面。',
          breadcrumb: [{ label: '首頁', to: '/app/dashboard' }, { label: '儀表板' }],
        },
      },
      {
        path: 'demo/list',
        name: 'demo-list',
        component: () => import('@/views/app/demo/DemoListView.vue'),
        meta: {
          permission: 'demo:read',
          title: '範例列表',
          description: '查詢條件、表格、分頁、排序、刪除確認（AlertDialog）。資料來自 api/demo 本地假資料。',
          breadcrumb: [
            { label: '首頁', to: '/app/dashboard' },
            { label: '範例', to: '/app/demo/list' },
            { label: '列表' },
          ],
        },
      },
      {
        path: 'demo/create',
        name: 'demo-create',
        component: () => import('@/views/app/demo/DemoCreateView.vue'),
        meta: {
          permission: 'demo:write',
          title: '範例新增',
          description: 'VeeValidate + Zod，送出後寫入 api/demo 假資料。',
          breadcrumb: [
            { label: '首頁', to: '/app/dashboard' },
            { label: '範例', to: '/app/demo/list' },
            { label: '新增' },
          ],
        },
      },
      {
        path: 'demo/upload',
        name: 'demo-upload',
        component: () => import('@/views/app/demo/DemoUploadView.vue'),
        meta: {
          permission: 'demo:write',
          title: '範例上傳',
          description: '選擇檔案後送出占位；實務請以 FormData 呼叫上傳 API。',
          breadcrumb: [
            { label: '首頁', to: '/app/dashboard' },
            { label: '範例', to: '/app/demo/list' },
            { label: '上傳' },
          ],
        },
      },
      {
        path: 'demo/:id',
        name: 'demo-detail',
        component: () => import('@/views/app/demo/DemoDetailView.vue'),
        meta: {
          permission: 'demo:read',
          title: '範例詳情',
          description: '查詢單筆資料並顯示詳細資訊。',
          breadcrumb: [
            { label: '首頁', to: '/app/dashboard' },
            { label: '範例', to: '/app/demo/list' },
            { label: '詳情' },
          ],
        },
      },
      {
        path: 'demo/:id/edit',
        name: 'demo-edit',
        component: () => import('@/views/app/demo/DemoEditView.vue'),
        meta: {
          permission: 'demo:write',
          title: '範例編輯',
          description: 'VeeValidate + Zod 表單，編輯單筆資料。',
          breadcrumb: [
            { label: '首頁', to: '/app/dashboard' },
            { label: '範例', to: '/app/demo/list' },
            { label: '編輯' },
          ],
        },
      },
      {
        path: 'permission',
        name: 'permission-demo',
        component: () => import('@/views/app/PermissionDemoView.vue'),
        meta: {
          permission: 'system:permission-demo',
          title: '權限示範',
          description: '此頁需 system:permission-demo 才能進入。按鈕使用 v-auth 依權限顯示。',
          breadcrumb: [{ label: '首頁', to: '/app/dashboard' }, { label: '權限示範' }],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFoundView.vue'),
    meta: { requiresAuth: false, title: '找不到頁面' },
  },
]
