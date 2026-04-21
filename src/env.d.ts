/// <reference types="vite/client" />

export {}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    /** 進入頁所需權限碼；未擁有時導向 403 */
    permission?: string
    /** 頁面標題、麵包屑 */
    title?: string
    breadcrumb?: readonly { label: string; to?: string }[]
  }
}
