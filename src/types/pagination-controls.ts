/**
 * DataPagination 可選顯示設定（QueryResultSection 可整包傳入）
 */
export interface DataPaginationDisplayOptions {
  /** 顯示「共 N 筆；目前第 X~Y 筆」，預設 false */
  showRange?: boolean
  /** 第一頁／最後一頁按鈕，預設 false */
  showFirstLast?: boolean
  /** 最多 10 個頁碼鈕（滑動視窗），預設 false */
  showPageNumbers?: boolean
  navButtonVariant?: 'icon' | 'text'
  showJump?: boolean
  jumpStyle?: 'select' | 'input'
  showPageSize?: boolean
  pageSizeOptions?: number[]
}
