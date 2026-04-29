/// <reference types="vite/client" />

import type { NavIconName } from '@/constants/navIcons'

export {}

declare global {
  interface ImportMetaEnv {
    /** 後端 API 基底 URL；由各環境 .env.[mode] 或 CI 注入 */
    readonly VITE_API_BASE_URL?: string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    /** 進入頁所需權限碼；未擁有時導向 403 */
    permission?: string
    /** 頁面標題；側欄選單文字預設同此欄位 */
    title?: string
    /** `PageHeader` 副標／說明 */
    description?: string
    /** `PageHeader` 麵包屑；最末段通常不加 `to` */
    breadcrumb?: readonly { label: string; to?: string }[]
    /** 若有設定，側欄會顯示此路由；文案預設用 `title` */
    nav?: {
      section: string
      /** 分區排序，數字小者在上 */
      sectionOrder?: number
      /** 同分區內排序 */
      order?: number
      icon?: NavIconName
    }
  }
}
