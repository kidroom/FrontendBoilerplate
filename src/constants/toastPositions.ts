/**
 * Toast 錨點位置（與 vue-sonner `Position` 一致）。
 * 帶入時使用：`{ position: TOAST_POSITION.TopRight }` 或字串 `'top-right'`。
 */
export const TOAST_POSITION = {
  TopLeft: 'top-left',
  TopRight: 'top-right',
  TopCenter: 'top-center',
  BottomLeft: 'bottom-left',
  BottomRight: 'bottom-right',
  BottomCenter: 'bottom-center',
} as const
