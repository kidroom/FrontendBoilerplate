export type QueryColumnAlign = 'left' | 'center' | 'right'

export type QueryColumnContentType = 'text' | 'button' | 'checkbox' | 'image' | 'icon'

/** 與 `@/components/ui/button` variant 對齊 */
export type QueryColumnButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

export interface QueryResultColumnButton {
  id: string
  label: string
  variant?: QueryColumnButtonVariant
}

/**
 * 查詢結果表格欄位：依 key 從列資料取值並套用 type 顯示。
 * header / cell 預設靠左；th、td 皆垂直置中（於元件內固定）。
 */
export interface QueryResultColumnDef<T extends Record<string, unknown> = Record<string, unknown>> {
  /** 對應 row 的欄位路徑，支援 `a.b`；純操作欄可用不重複的 key（如 `_actions`） */
  key: string
  title: string
  headerAlign?: QueryColumnAlign
  cellAlign?: QueryColumnAlign
  type?: QueryColumnContentType
  /** 表頭排序（由父層處理查詢）；與後端 sort 欄位對應 */
  sortable?: boolean
  sortField?: string
  /** type=text：顯示字串；未提供則 String(value) */
  format?: (row: T, value: unknown) => string
  /** type=button */
  buttons?: QueryResultColumnButton[]
  /** type=image */
  imageSrc?: (row: T, value: unknown) => string
  imageAlt?: (row: T) => string
  /** type=icon：見 `@/utils/query-table-icons` 的 `queryTableIconMap` 鍵名，例如 `FileText` */
  iconName?: string
  /** type=checkbox */
  getChecked?: (row: T) => boolean
}
