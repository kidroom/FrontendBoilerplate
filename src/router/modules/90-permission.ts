import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

/** 後台 `/app/*`：側欄項目由子路由 `meta.nav` 決定，勿再維護獨立 navigation 清單 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'permission-demo',
        name: 'permission-demo',
        component: () => import('@/views/app/permission-demo/PermissionDemoLayout.vue'),
        redirect: { name: 'permission-demo-roles' },
        meta: {
          title: '權限示範',
          description: '角色／使用者 CRUD 示範、v-auth 與權限碼（串接 auth API）',
          permission: 'permission',
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
              description: 'POST /roles（body：name）',
              permission: 'permission-create-role',
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
              description: 'PATCH /roles/:id',
              permission: 'permission-edit-role',
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
            path: 'roles/:id/functions',
            name: 'permission-demo-role-functions',
            component: () => import('@/views/app/permission-demo/PermissionDemoRoleFunctionsView.vue'),
            meta: {
              title: '角色功能權限',
              description: 'GET /roles/:id/functions、PATCH /roles/:id/functions/status',
              permission: 'permission-edit-funtion',
              requiresAuth: true,
              breadcrumb: [
                { label: '系統' },
                { label: '權限示範', to: '/app/permission-demo/roles' },
                { label: '角色清單', to: '/app/permission-demo/roles' },
                { label: '功能權限' },
              ],
            },
          },
          {
            path: 'users',
            name: 'permission-demo-users',
            component: () => import('@/views/app/permission-demo/PermissionDemoUserListView.vue'),
            meta: {
              title: '使用者清單',
              description: 'GET /users；關鍵字與角色篩選',
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
              permission: 'permission-create-user',
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
              description: 'PATCH /users/:id',
              permission: 'permission-edit-user',
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
