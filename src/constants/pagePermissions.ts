/**
 * 建立角色時可勾選的「頁面／功能」權限碼（與路由 `meta.permission` 或按鈕級權限對齊）。
 * 接真實後端時請改由 API 回傳可指派清單。
 */
export const ROLE_ASSIGNABLE_PAGE_PERMISSIONS = [
  { code: 'demo:read', label: '範例－列表／詳情（頁面）' },
  { code: 'demo:write', label: '範例－新增／編輯／上傳（頁面）' },
  { code: 'demo:delete', label: '範例－刪除（按鈕）' },
  { code: 'system:permission-demo', label: '系統－權限示範（頁面）' },
] as const

export type AssignablePermissionCode = (typeof ROLE_ASSIGNABLE_PAGE_PERMISSIONS)[number]['code']
