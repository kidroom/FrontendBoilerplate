/** 權限示範頁顯示用（由 {@link GetRolesResponse} 等映射） */
export interface PermissionDemoRole {
  id: string
  name: string
  isEnabled: boolean
}

export interface PermissionDemoUser {
  id: string
  account: string
  displayName: string
  roleId: string
  roleName: string
  isApproved: boolean
  createDate: string
  remark: string | null
}
