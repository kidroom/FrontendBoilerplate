import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { CheckboxTriState } from '@/types/auth'

export interface PermissionFunctionTreeContext {
  triStateById: ComputedRef<Map<string, CheckboxTriState>>
  expandedById: Ref<Record<string, boolean>>
  toggleExpand: (id: string) => void
}

export const permissionFunctionTreeKey: InjectionKey<PermissionFunctionTreeContext> =
  Symbol('permissionFunctionTree')
