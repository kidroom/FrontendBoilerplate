/** 可抽換的版面／配色預設（對應 `html[data-theme]`） */
export type ThemePresetId = 'crm-taiwan' | 'minimal'

export type ColorMode = 'light' | 'dark'

export const THEME_PRESET_LABELS: Record<ThemePresetId, string> = {
  'crm-taiwan': '藍色調 (預設)',
  minimal: '極簡中性',
}

/** 下拉選單顯示順序 */
export const THEME_PRESET_IDS: ThemePresetId[] = ['crm-taiwan', 'minimal']
