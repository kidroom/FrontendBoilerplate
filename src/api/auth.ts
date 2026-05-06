import { z } from 'zod'
import { http } from '@/utils/http'
import type { ApiResult } from '@/types/api'
import type {
  CreateRoleRequest,
  CreateRoleResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetRolesResponse,
  GetUsersRequest,
  GetUsersResponse,
  LoginRequest,
  LoginResult,
  RoleFunction,
  UpdateRoleRequest,
  UpdateRoleResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetRoleFunctionsResponse,
  UpdateRoleFunctionsStatusRequest,
} from '@/types/auth'
const roleFunctionSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    parentName: z.string().nullable(),
    icon: z.string().nullable(),
    sort: z.coerce.number(),
    children: z.array(roleFunctionSchema).default([]),
  }),
) as z.ZodType<RoleFunction>

const loginResultSchema: z.ZodType<LoginResult> = z.object({
  token: z.string().min(1),
  refreshToken: z.string(),
  roleFunctions: z.array(roleFunctionSchema),
  id: z.string(),
  account: z.string(),
  name: z.string(),
  isApproved: z.coerce.boolean(),
  lastLoginTime: z.string(),
  roleId: z.string(),
})

const loginResponseWrappedSchema = z.object({
  value: loginResultSchema,
})

function parseLoginResponse(data: unknown): LoginResult {
  const wrapped = loginResponseWrappedSchema.safeParse(data)
  if (wrapped.success) {
    return wrapped.data.value
  }
  const direct = loginResultSchema.safeParse(data)
  if (direct.success) {
    return direct.data
  }
  const issues = [...wrapped.error.issues, ...direct.error.issues]
  const detail = issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
  throw new Error(detail ? `登入回應格式不符：${detail}` : '登入回應格式不符')
}

/** 與登入相同，部分端點將本文包在 `value` 內 */
function unwrapEnvelope(raw: unknown): unknown {
  const wrapped = z.object({ value: z.unknown() }).safeParse(raw)
  if (wrapped.success) {
    return wrapped.data.value
  }
  return raw
}

function zodErrorSummary(err: z.ZodError): string {
  return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
}

const roleInfoSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    IsEnabled: z.coerce.boolean().optional(),
    isEnabled: z.coerce.boolean().optional(),
  })
  .passthrough()
  .transform((row) => ({
    id: row.id,
    name: row.name,
    IsEnabled: row.IsEnabled ?? row.isEnabled ?? false,
  }))

const getRolesResponseSchema = z.object({
  roles: z.array(roleInfoSchema),
})

function parseGetRolesResponse(data: unknown): GetRolesResponse {
  const payload = unwrapEnvelope(data)
  const parsed = getRolesResponseSchema.safeParse(payload)
  if (parsed.success) {
    return parsed.data
  }
  throw new Error(`取得角色清單格式不符：${zodErrorSummary(parsed.error)}`)
}

const createRoleResponseSchema = z.object({ roleId: z.string() })

function parseCreateRoleResponse(data: unknown): CreateRoleResponse {
  try {
    return createRoleResponseSchema.parse(unwrapEnvelope(data))
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`建立角色回應格式不符：${zodErrorSummary(e)}`)
    }
    throw e
  }
}

function toIsoOrNull(v: string | Date | null | undefined): string | null {
  if (v === null || v === undefined) return null
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString()
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString()
}

function toIso(v: string | Date): string {
  const out = toIsoOrNull(v)
  return out ?? ''
}

const userInfoSchema = z
  .object({
    id: z.string(),
    account: z.string(),
    name: z.string(),
    email: z.union([z.string(), z.null()]).optional(),
    isApproved: z.coerce.boolean().optional(),
    LastLoginTime: z.union([z.string(), z.coerce.date(), z.null()]).optional(),
    lastLoginTime: z.union([z.string(), z.coerce.date(), z.null()]).optional(),
    remark: z.union([z.string(), z.null()]).optional(),
    roleId: z.string(),
    roleName: z.string(),
    CreateDate: z.union([z.string(), z.coerce.date()]).optional(),
    createDate: z.union([z.string(), z.coerce.date()]).optional(),
  })
  .passthrough()
  .transform((row) => ({
    id: row.id,
    account: row.account,
    name: row.name,
    email: row.email ?? null,
    isApproved: row.isApproved ?? false,
    lastLoginTime: toIsoOrNull(row.lastLoginTime ?? row.LastLoginTime ?? null),
    remark: row.remark ?? null,
    roleId: row.roleId,
    roleName: row.roleName,
    createDate: (() => {
      const raw = row.createDate ?? row.CreateDate
      return raw !== undefined && raw !== null ? toIso(raw) : ''
    })(),
  }))

const getUsersResponseSchema = z
  .object({
    Users: z.array(userInfoSchema).optional(),
    users: z.array(userInfoSchema).optional(),
  })
  .passthrough()
  .transform((row): GetUsersResponse => ({
    Users: row.Users ?? row.users ?? [],
  }))

function parseGetUsersResponse(data: unknown): GetUsersResponse {
  const payload = unwrapEnvelope(data)
  const parsed = getUsersResponseSchema.safeParse(payload)
  if (parsed.success) {
    return parsed.data
  }
  throw new Error(`取得使用者清單格式不符：${zodErrorSummary(parsed.error)}`)
}

function buildGetUsersParams(payload: GetUsersRequest): Record<string, string> {
  const out: Record<string, string> = {}
  if (payload.keyword !== null && payload.keyword !== '') {
    out.keyword = payload.keyword
  }
  if (payload.roleId !== null && payload.roleId !== '') {
    out.roleId = payload.roleId
  }
  return out
}

const createUserResponseSchema = z
  .object({
    id: z.string(),
    account: z.string(),
    name: z.string(),
    isApproved: z.coerce.boolean(),
    roleId: z.string(),
    remark: z.union([z.string(), z.null()]).optional(),
    createDate: z.union([z.string(), z.coerce.date()]),
  })
  .passthrough()
  .transform(
    (row): CreateUserResponse => ({
      id: row.id,
      account: row.account,
      name: row.name,
      isApproved: row.isApproved,
      roleId: row.roleId,
      remark: row.remark ?? '',
      createDate: toIso(row.createDate),
    }),
  )

function parseCreateUserResponse(data: unknown): CreateUserResponse {
  const payload = unwrapEnvelope(data)
  const parsed = createUserResponseSchema.safeParse(payload)
  if (parsed.success) {
    return parsed.data
  }
  throw new Error(`建立使用者回應格式不符：${zodErrorSummary(parsed.error)}`)
}

const updateRoleResponseSchema = z.object({ roleId: z.string() })

function parseUpdateRoleResponse(data: unknown): UpdateRoleResponse {
  try {
    return updateRoleResponseSchema.parse(unwrapEnvelope(data))
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`更新角色回應格式不符：${zodErrorSummary(e)}`)
    }
    throw e
  }
}

const updateUserResponseSchema = z
  .object({ id: z.string() })
  .passthrough()
  .transform((row): UpdateUserResponse => ({ id: row.id }))

function parseUpdateUserResponse(data: unknown): UpdateUserResponse {
  try {
    return updateUserResponseSchema.parse(unwrapEnvelope(data))
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`更新使用者回應格式不符：${zodErrorSummary(e)}`)
    }
    throw e
  }
}

const apiResultSchema = z
  .object({
    isSuccess: z.boolean(),
    isFailure: z.boolean(),
    error: z
      .object({
        code: z.string(),
        description: z.string(),
        message: z.string(),
        type: z.coerce.number(),
      })
      .passthrough(),
  })
  .passthrough()
  .transform((row): ApiResult => ({
    isSuccess: row.isSuccess,
    isFailure: row.isFailure,
    error: row.error,
  }))

function parseApiResult(data: unknown): ApiResult {
  try {
    return apiResultSchema.parse(unwrapEnvelope(data))
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`API 回應格式不符：${zodErrorSummary(e)}`)
    }
    throw e
  }
}

/**
 * 由選單／功能樹收集權限碼（預設使用節點 `id`；若後端以其他欄位代表權限，請改此函式）。
 */
export function collectPermissionCodesFromRoleFunctions(nodes: readonly RoleFunction[]): string[] {
  const names = new Set<string>()
  function walk(list: readonly RoleFunction[]) {
    for (const node of list) {
      if (node.name.length > 0) names.add(node.name)
      if (node.children.length > 0) walk(node.children)
    }
  }
  walk(nodes)
  return [...names]
}

/**
 * 登入：依後端契約呼叫 API，並將回應正規化為 {@link LoginResult}。
 */
export async function login(payload: LoginRequest): Promise<LoginResult> {
  const { data } = await http.patch<unknown>('/users/login', payload)
  return parseLoginResponse(data)
}

export async function getRoles(): Promise<GetRolesResponse> {
  const { data } = await http.get<unknown>('/roles')
  return parseGetRolesResponse(data)
}

export async function createRole(payload: CreateRoleRequest): Promise<CreateRoleResponse> {
  const { data } = await http.post<unknown>('/roles', payload)
  return parseCreateRoleResponse(data)
}

export async function updateRole(id: string, payload: UpdateRoleRequest): Promise<UpdateRoleResponse> {
  const { data } = await http.patch<unknown>('/roles/' + id, payload)
  return parseUpdateRoleResponse(data)
}

export async function deleteRole(id: string): Promise<ApiResult> {
  const { data } = await http.delete<unknown>('/roles/' + id)
  return parseApiResult(data)
}

export async function getRoleFunctions(id: string): Promise<GetRoleFunctionsResponse> {
  const { data } = await http.get<GetRoleFunctionsResponse>('/roles/' + id + '/functions')
  return data
}

export async function updateRoleFunctionsStatus(id: string, payload: UpdateRoleFunctionsStatusRequest): Promise<ApiResult> {
  const { data } = await http.patch<unknown>('/roles/' + id + '/functions/status', payload)
  return parseApiResult(data)
}

export async function getUsers(payload: GetUsersRequest): Promise<GetUsersResponse> {
  const { data } = await http.get<unknown>('/users', { params: buildGetUsersParams(payload) })
  return parseGetUsersResponse(data)
}

export async function createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
  const { data } = await http.post<unknown>('/users', payload)
  return parseCreateUserResponse(data)
}

export async function updateUser(id: string, payload: UpdateUserRequest): Promise<UpdateUserResponse> {
  const { data } = await http.patch<unknown>('/users/' + id, payload)
  return parseUpdateUserResponse(data)
}

export async function deleteUser(id: string): Promise<ApiResult> {
  const { data } = await http.delete<unknown>('/users/' + id)
  return parseApiResult(data)
}