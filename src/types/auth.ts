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

export interface Role {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface GetRolesResponse {
  roles: RoleInfo[]
}

export interface RoleInfo {
  id: string
  name: string
  IsEnabled: boolean
}

export interface CreateRoleRequest {
  name: string
}

export interface CreateRoleResponse {
  roleId: string
}

export interface UpdateRoleRequest {
  name: string
}

export interface UpdateRoleResponse {
  roleId: string
}

export interface GetRoleFunctionsResponse {
  functions: FunctionPermissionInfo[]
}

export interface FunctionPermissionInfo {
  id: string
  name: string
  parentName: string | null
  isEnabled: boolean
}

export interface UpdateRoleFunctionsStatusRequest {
  functions: FunctionStatusUpdate[]
}

export interface FunctionStatusUpdate {
  id: string
  isEnabled: boolean
}

export interface GetUsersRequest {
  keyword: string | null
  roleId: string | null
}

export interface GetUsersResponse {
  Users: UserInfo[]
}
export interface UserInfo {
  id: string
  account: string
  name: string
  email: string | null
  isApproved: boolean
  lastLoginTime: string | null
  remark: string | null
  roleId: string
  roleName: string
  /** ISO 字串（由 API 解析正規化） */
  createDate: string
}

export interface CreateUserRequest {
  account: string
  pass: string
  name: string
  roleId: string
  remark: string
}

export interface CreateUserResponse {
  id: string
  account: string
  name: string
  isApproved: boolean
  roleId: string
  remark: string
  createDate: string
}

/** PATCH `/users/updateUser/:id` 本文（依後端契約調整） */
export interface UpdateUserRequest {
  name: string
  roleId: string
  remark: string
}

export interface UpdateUserResponse {
  id: string
}
