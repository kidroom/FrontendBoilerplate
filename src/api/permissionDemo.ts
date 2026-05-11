import {
  createRole,
  createUser,
  deleteRole,
  deleteUser,
  getRoleFunctions,
  getRoles,
  getUsers,
  updateRole,
  updateRoleFunctionsStatus,
  updateUser,
} from '@/api/auth'
import type { ApiResult } from '@/types/api'
import type {
  GetUsersRequest,
  UpdateRoleFunctionsStatusRequest,
  UpdateRoleRequest,
  UpdateUserRequest,
} from '@/types/auth'
import type { PermissionDemoRole, PermissionDemoUser } from '@/types/permissionDemo'

export async function fetchPermissionDemoRoles(): Promise<PermissionDemoRole[]> {
  const { roles } = await getRoles()
  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    isEnabled: r.IsEnabled,
  }))
}

export async function fetchPermissionDemoRoleById(id: string): Promise<PermissionDemoRole | null> {
  const rows = await fetchPermissionDemoRoles()
  return rows.find((r) => r.id === id) ?? null
}

export async function fetchPermissionDemoUsers(query: GetUsersRequest): Promise<PermissionDemoUser[]> {
  const { Users } = await getUsers(query)
  return Users.map((u) => ({
    id: u.id,
    account: u.account,
    displayName: u.name,
    roleId: u.roleId,
    roleName: u.roleName,
    isApproved: u.isApproved,
    createDate: u.createDate,
    remark: u.remark,
  }))
}

export async function fetchPermissionDemoUserById(id: string): Promise<PermissionDemoUser | null> {
  const rows = await fetchPermissionDemoUsers({ keyword: null, roleId: null })
  return rows.find((u) => u.id === id) ?? null
}

export async function createPermissionDemoRole(payload: { name: string }): Promise<void> {
  await createRole({ name: payload.name.trim() })
}

export async function createPermissionDemoUser(payload: {
  account: string
  pass: string
  displayName: string
  roleId: string
  remark: string
}): Promise<void> {
  await createUser({
    account: payload.account.trim(),
    pass: payload.pass,
    name: payload.displayName.trim(),
    roleId: payload.roleId,
    remark: payload.remark.trim(),
  })
}

export async function updatePermissionDemoRole(id: string, payload: UpdateRoleRequest): Promise<void> {
  await updateRole(id, payload)
}

export async function deletePermissionDemoRole(id: string): Promise<ApiResult> {
  return deleteRole(id)
}

export async function updatePermissionDemoUser(id: string, payload: UpdateUserRequest): Promise<void> {
  await updateUser(id, payload)
}

export async function deletePermissionDemoUser(id: string): Promise<ApiResult> {
  return deleteUser(id)
}

export async function fetchPermissionDemoRoleFunctions(roleId: string) {
  return getRoleFunctions(roleId)
}

export async function savePermissionDemoRoleFunctions(
  roleId: string,
  payload: UpdateRoleFunctionsStatusRequest,
): Promise<ApiResult> {
  return updateRoleFunctionsStatus(roleId, payload)
}
