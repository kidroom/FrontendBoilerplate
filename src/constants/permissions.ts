/**
 * 登入後預設注入的權限碼（開發／模板用）。
 * 實務請改為登入 API 回傳的權限列表。
 */
export const TEMPLATE_DEFAULT_PERMISSIONS = [
  'demo:read',
  'demo:write',
  'demo:delete',
  'system:permission-demo',
] as const
