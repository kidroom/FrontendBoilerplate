/** POST/PATCH `/users/login` 請求本文 */
export interface LoginRequest {
  account: string
  pass: string
}

export interface RoleFunction {
  id: string
  name: string
  parentName: string | null
  icon: string | null
  sort: number
  children: RoleFunction[]
}

/** 登入成功後後端回傳的使用者／權限樹資料（可能包在 `value` 內） */
export interface LoginResult {
  token: string
  refreshToken: string
  roleFunctions: RoleFunction[]
  id: string
  account: string
  name: string
  isApproved: boolean
  lastLoginTime: string
  roleId: string
}
