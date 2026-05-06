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
        component: () => import('@/views/app/permission-demo/PermissionDemoLayout.vue'),
        redirect: { name: 'permission-demo-roles' },
        meta: {
          title: '權限示範',
          description: '角色／使用者 CRUD 示範、v-auth 與權限碼（串接 auth API）',
          permission: 'system:permission-demo',
          requiresAuth: true,
          breadcrumb: [{ label: '系統' }, { label: '權限示範' }],
          nav: { section: '系統', sectionOrder: 20, order: 0, icon: 'ShieldCheck' },
        },
        children: [
          {
            path: 'roles',
            name: 'permission-demo-roles',
            component: () => import('@/views/app/permission-demo/PermissionDemoRoleListView.vue'),
            meta: {
              title: '角色清單',
              description: '示範角色列表（對應可指派的頁面權限碼）',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/roles' },
                { label: '角色清單' },
              ],
            },
          },
          {
            path: 'roles/create',
            name: 'permission-demo-role-create',
            component: () => import('@/views/app/permission-demo/PermissionDemoRoleCreateView.vue'),
            meta: {
              title: '建立角色',
              description: '呼叫 POST /roles/createRole（依後端契約僅含角色名稱）',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/roles' },
                { label: '角色清單', to: '/app/permission-demo/roles' },
                { label: '建立' },
              ],
            },
          },
          {
            path: 'roles/:id/edit',
            name: 'permission-demo-role-edit',
            component: () => import('@/views/app/permission-demo/PermissionDemoRoleEditView.vue'),
            meta: {
              title: '編輯角色',
              description: 'PATCH /users/updateRole/:id',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/roles' },
                { label: '角色清單', to: '/app/permission-demo/roles' },
                { label: '編輯' },
              ],
            },
          },
          {
            path: 'users',
            name: 'permission-demo-users',
            component: () => import('@/views/app/permission-demo/PermissionDemoUserListView.vue'),
            meta: {
              title: '使用者清單',
              description: 'GET /users/getUsers；關鍵字與角色篩選',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/users' },
                { label: '使用者清單' },
              ],
            },
          },
          {
            path: 'users/create',
            name: 'permission-demo-user-create',
            component: () => import('@/views/app/permission-demo/PermissionDemoUserCreateView.vue'),
            meta: {
              title: '建立使用者',
              description: 'POST /users/createUser；帳號、密碼、顯示名稱（name）、角色必填，備註可空',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/users' },
                { label: '使用者清單', to: '/app/permission-demo/users' },
                { label: '建立' },
              ],
            },
          },
          {
            path: 'users/:id/edit',
            name: 'permission-demo-user-edit',
            component: () => import('@/views/app/permission-demo/PermissionDemoUserEditView.vue'),
            meta: {
              title: '編輯使用者',
              description: 'PATCH /users/updateUser/:id',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/users' },
                { label: '使用者清單', to: '/app/permission-demo/users' },
                { label: '編輯' },
              ],
            },
          },
          {
            path: 'playground',
            name: 'permission-demo-playground',
            component: () => import('@/views/app/permission-demo/PermissionDemoPlaygroundView.vue'),
            meta: {
              title: '按鈕級權限示範',
              description: 'v-auth 與目前登入權限集合',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/playground' },
                { label: '按鈕示範' },
              ],
            },
          },
        ],
      },
    ],
  },
]
