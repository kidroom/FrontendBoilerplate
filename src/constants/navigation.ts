import type { RouteLocationRaw } from 'vue-router'
import type { LucideIcon } from 'lucide-vue-next'
import {
  LayoutDashboard,
  List,
  PenSquare,
  ShieldCheck,
  Upload,
} from 'lucide-vue-next'

/** 側欄選單圖示（對齊 [Sakai](https://github.com/primefaces/sakai-vue) 左欄圖示＋文字模式） */
export const NAV_ICON_MAP = {
  LayoutDashboard,
  List,
  PenSquare,
  Upload,
  ShieldCheck,
} as const satisfies Record<string, LucideIcon>

export type NavIconName = keyof typeof NAV_ICON_MAP

export interface NavItem {
  label: string
  to: RouteLocationRaw
  /** 對應後端或選單權限碼，僅用於顯示／v-auth 示範，可為空 */
  permission?: string
  icon?: NavIconName
}

export interface NavSection {
  title: string
  items: readonly NavItem[]
}

/** 側欄主選單：分區標題＋項目（模板示範，實務請改為 API 或設定檔） */
export const APP_NAV_SECTIONS: readonly NavSection[] = [
  {
    title: '主選單',
    items: [{ label: '儀表板', to: { name: 'dashboard' }, icon: 'LayoutDashboard' }],
  },
  {
    title: '範例',
    items: [
      { label: '範例列表', to: { name: 'demo-list' }, permission: 'demo:read', icon: 'List' },
      { label: '範例新增', to: { name: 'demo-create' }, permission: 'demo:write', icon: 'PenSquare' },
      { label: '範例上傳', to: { name: 'demo-upload' }, permission: 'demo:write', icon: 'Upload' },
    ],
  },
  {
    title: '系統',
    items: [
      {
        label: '權限示範',
        to: { name: 'permission-demo' },
        permission: 'system:permission-demo',
        icon: 'ShieldCheck',
      },
    ],
  },
] as const
