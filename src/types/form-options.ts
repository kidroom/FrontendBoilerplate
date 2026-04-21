/** 下拉、Radio、Checkbox 群組共用的選項結構 */
export interface FormOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}
