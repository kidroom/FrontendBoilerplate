import type { Component } from 'vue'
import type { ExternalToast } from 'vue-sonner'

/**
 * Toast 相關型別統一由此 re-export，業務與 composable 請由此匯入以維持可擴充與單一來源。
 */
export type {
  Action,
  ExternalToast,
  ToastClasses,
  ToastT,
  ToastToDismiss,
  ToasterProps,
} from 'vue-sonner'

/** 單次呼叫可覆寫的錨點位置（亦為 `toast.*` 第二參數的 `position`） */
export type ToastPosition = NonNullable<ExternalToast['position']>

/** 第一則參數可為字串／元件；與 vue-sonner 的 `toast()` 一致 */
export type ToastTitle = string | Component | (() => string | Component)

/**
 * 物件形式呼叫：`toast.show({ message, variant, position, duration, ... })`
 * 其餘欄位與 `ExternalToast` 相同，可傳 `description`、`action`、`classes` 等。
 */
export type ShowToastOptions = {
  message: ToastTitle
  variant?: 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'
} & ExternalToast
