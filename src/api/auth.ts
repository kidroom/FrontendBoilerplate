import { z } from 'zod'
import { http } from '@/utils/http'
import type { LoginRequest, LoginResult, RoleFunction } from '@/types/auth'

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
