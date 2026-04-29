import type { LucideIcon } from 'lucide-vue-next'
import {
  LayoutDashboard,
  List,
  PenSquare,
  ShieldCheck,
  Upload,
} from 'lucide-vue-next'

/** 側欄選單圖示（對齊 Sakai 左欄圖示＋文字模式）；路由 `meta.nav.icon` 使用此處鍵名 */
export const NAV_ICON_MAP = {
  LayoutDashboard,
  List,
  PenSquare,
  Upload,
  ShieldCheck,
} as const satisfies Record<string, LucideIcon>

export type NavIconName = keyof typeof NAV_ICON_MAP
