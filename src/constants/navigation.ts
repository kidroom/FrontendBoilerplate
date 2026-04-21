import type { RouteLocationRaw } from 'vue-router'

export interface NavItem {
  label: string
  to: RouteLocationRaw
  /** 對應後端或選單權限碼，僅用於顯示／v-auth 示範，可為空 */
  permission?: string
}

/** 側欄主選單（模板示範，實務請改為 API 或設定檔） */
export const APP_NAV_ITEMS: readonly NavItem[] = [
  { label: '儀表板', to: { name: 'dashboard' } },
  { label: '範例列表', to: { name: 'demo-list' }, permission: 'demo:read' },
  { label: '範例新增', to: { name: 'demo-create' }, permission: 'demo:write' },
  { label: '範例上傳', to: { name: 'demo-upload' }, permission: 'demo:write' },
  { label: '權限示範', to: { name: 'permission-demo' }, permission: 'system:permission-demo' },
] as const
