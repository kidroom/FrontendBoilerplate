import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

/** 後台 `/app/*`：側欄項目由子路由 `meta.nav` 決定，勿再維護獨立 navigation 清單 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/app/DashboardView.vue'),
        meta: {
          title: '儀表板',
          description: '後台首頁與功能入口',
          requiresAuth: true,
          nav: { section: '主選單', sectionOrder: 0, order: 0, icon: 'LayoutDashboard' },
        },
      },
      {
        path: 'demo/create',
        name: 'demo-create',
        component: () => import('@/views/app/demo/DemoCreateView.vue'),
        meta: {
          title: '範例新增',
          description: 'VeeValidate + Zod 表單驗證範例',
          permission: 'demo:write',
          requiresAuth: true,
          breadcrumb: [
            { label: '範例', to: '/app/demo' },
            { label: '新增' },
          ],
          nav: { section: '範例', sectionOrder: 10, order: 10, icon: 'PenSquare' },
        },
      },
      {
        path: 'demo/upload',
        name: 'demo-upload',
        component: () => import('@/views/app/demo/DemoUploadView.vue'),
        meta: {
          title: '範例上傳',
          description: '檔案選取與送出占位',
          permission: 'demo:write',
          requiresAuth: true,
          breadcrumb: [
            { label: '範例', to: '/app/demo' },
            { label: '上傳' },
          ],
          nav: { section: '範例', sectionOrder: 10, order: 20, icon: 'Upload' },
        },
      },
      {
        path: 'demo/:id/edit',
        name: 'demo-edit',
        component: () => import('@/views/app/demo/DemoEditView.vue'),
        meta: {
          title: '範例編輯',
          description: '編輯既有範例資料',
          permission: 'demo:write',
          requiresAuth: true,
          breadcrumb: [
            { label: '範例', to: '/app/demo' },
            { label: '編輯' },
          ],
        },
      },
      {
        path: 'demo/:id',
        name: 'demo-detail',
        component: () => import('@/views/app/demo/DemoDetailView.vue'),
        meta: {
          title: '範例詳情',
          description: '檢視單筆範例',
          permission: 'demo:read',
          requiresAuth: true,
          breadcrumb: [
            { label: '範例', to: '/app/demo' },
            { label: '詳情' },
          ],
        },
      },
      {
        path: 'demo',
        name: 'demo-list',
        component: () => import('@/views/app/demo/DemoListView.vue'),
        meta: {
          title: '範例列表',
          description: '查詢、分頁、排序、刪除確認',
          permission: 'demo:read',
          requiresAuth: true,
          breadcrumb: [{ label: '範例', to: '/app/demo' }, { label: '列表' }],
          nav: { section: '範例', sectionOrder: 10, order: 0, icon: 'List' },
        },
      },
      {
        path: 'permission-demo',
        name: 'permission-demo',
        component: () => import('@/views/app/PermissionDemoView.vue'),
        meta: {
          title: '權限示範',
          description: 'v-auth、權限碼與後端角色功能對照',
          permission: 'system:permission-demo',
          requiresAuth: true,
          breadcrumb: [{ label: '系統' }, { label: '權限示範' }],
          nav: { section: '系統', sectionOrder: 20, order: 0, icon: 'ShieldCheck' },
        },
      },
    ],
  },
]
