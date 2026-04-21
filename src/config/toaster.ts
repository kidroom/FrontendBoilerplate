import type { ExternalToast, ToasterProps } from '@/types/toast'
import { TOAST_POSITION } from '@/constants/toastPositions'

/** 未在單次 toast 指定 `position` 時，會落在此錨點（見 vue-sonner `filteredToasts`） */
export const DEFAULT_TOASTER_POSITION = TOAST_POSITION.TopRight satisfies NonNullable<
  ToasterProps['position']
>

export type ToasterPosition = NonNullable<ToasterProps['position']>

/** 與設計系統對齊的 Toaster 預設（可於 App 或 Sonner 二次封裝覆寫） */
export const defaultToasterProps = {
  position: DEFAULT_TOASTER_POSITION,
  richColors: true,
  closeButton: true,
  expand: false,
  visibleToasts: 5,
  gap: 12,
  /** 固定於視窗邊緣，不佔版面流；層級見 style.css 變數 */
  offset: { top: '1rem', right: '1rem', bottom: '1rem', left: '1rem' },
} as const satisfies Partial<ToasterProps>

/** 單則 toast 的預設（與 Toaster 的 toastOptions 合併） */
export const defaultToastOptions: NonNullable<ToasterProps['toastOptions']> = {
  duration: 4000,
  class: 'border border-border shadow-md',
}

/**
 * 呼叫 toast() 時合併的預設，確保全站一致且各處可再覆寫。
 */
export const defaultExternalToastOptions = {
  duration: defaultToastOptions.duration,
  richColors: true,
  closeButton: true,
} as const satisfies Partial<ExternalToast>
