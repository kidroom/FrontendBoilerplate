import type { Component } from 'vue'
import { CircleHelp, FileText, Image as LucideImage } from 'lucide-vue-next'

/**
 * `QueryResultSection` 欄位 type=icon 時可用的圖示名稱（與 lucide 元件名對齊）。
 * 專案需要更多圖示時在此匯入並加入 map。
 */
export const queryTableIconMap: Record<string, Component> = {
  FileText,
  Image: LucideImage,
  CircleHelp,
}

export function resolveQueryTableIcon(name?: string): Component | null {
  if (!name) return null
  return queryTableIconMap[name] ?? null
}
