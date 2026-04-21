import { toast as sonnerToast } from 'vue-sonner'
import type { Component } from 'vue'
import { defaultExternalToastOptions } from '@/config/toaster'
import type { ExternalToast, ShowToastOptions } from '@/types/toast'

function mergeExternal(data?: ExternalToast): ExternalToast | undefined {
  if (data === undefined) {
    return { ...defaultExternalToastOptions }
  }
  return { ...defaultExternalToastOptions, ...data }
}

type ToastTitle = Parameters<typeof sonnerToast>[0]

type PromiseArg = NonNullable<Parameters<typeof sonnerToast.promise>[1]>

function showToast(options: ShowToastOptions): ReturnType<typeof sonnerToast> {
  const { message, variant = 'default', ...rest } = options
  const data = mergeExternal(rest)
  switch (variant) {
    case 'success':
      return sonnerToast.success(message, data)
    case 'error':
      return sonnerToast.error(message, data)
    case 'info':
      return sonnerToast.info(message, data)
    case 'warning':
      return sonnerToast.warning(message, data)
    case 'loading':
      return sonnerToast.loading(message, data)
    default:
      return sonnerToast(message, data)
  }
}

/**
 * 全域 Toast API（二次封裝）：預設集中於 `config/toaster`。
 *
 * - **位置／秒數等**：在第二參數帶入 `ExternalToast` 欄位即可覆寫，例如
 *   `toast.success('完成', { position: 'bottom-center', duration: 2000 })`
 * - **物件形式**：`toast.show({ message: '完成', variant: 'success', position: 'top-left', duration: 3000 })`
 */
export const toast = Object.assign(
  (message: ToastTitle, data?: ExternalToast) => sonnerToast(message, mergeExternal(data)),
  {
    success: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.success(message, mergeExternal(data)),
    error: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.error(message, mergeExternal(data)),
    info: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.info(message, mergeExternal(data)),
    warning: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.warning(message, mergeExternal(data)),
    loading: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.loading(message, mergeExternal(data)),
    message: (message: ToastTitle, data?: ExternalToast) =>
      sonnerToast.message(message, mergeExternal(data)),
    custom: (component: Component, data?: ExternalToast) =>
      sonnerToast.custom(component, mergeExternal(data)),
    show: showToast,
    promise: <T>(promise: Promise<T> | (() => Promise<T>), data?: PromiseArg) => {
      const base: PromiseArg = {
        ...defaultExternalToastOptions,
      }
      return sonnerToast.promise(promise, data ? { ...base, ...data } : base)
    },
    dismiss: sonnerToast.dismiss,
    getHistory: sonnerToast.getHistory,
    getToasts: sonnerToast.getToasts,
  },
)

export function useToast() {
  return { toast }
}

export type { ShowToastOptions }
