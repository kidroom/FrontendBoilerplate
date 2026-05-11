import type {
  CheckboxTriState,
  FunctionPermissionInfo,
  FunctionPermissionTreeNode,
} from '@/types/auth'

/**
 * 將後端回傳的扁平功能權限轉成樹狀：
 * - parentName 空值 → 父層
 * - parentName 有值但無法對應任一筆的 name → 父層
 * - parentName 有值且可對應其他項目的 name → 掛於該節點之下
 * - 若依 parentName 串接會形成循環，則該筆改視為父層，避免無法顯示
 */
export function buildFunctionPermissionTree(flat: FunctionPermissionInfo[]): FunctionPermissionTreeNode[] {
  if (flat.length === 0) return []

  const idToRow = new Map(flat.map((x) => [x.id, x]))
  const nameToId = new Map<string, string>()
  for (const item of flat) {
    const key = item.name.trim()
    if (!nameToId.has(key)) nameToId.set(key, item.id)
  }

  const idToNode = new Map<string, FunctionPermissionTreeNode>()
  for (const item of flat) {
    idToNode.set(item.id, {
      id: item.id,
      name: item.name,
      isEnabled: item.isEnabled,
      child: [],
    })
  }

  function resolveParentId(item: FunctionPermissionInfo): string | null {
    const p = (item.parentName ?? '').trim()
    if (p === '' || !nameToId.has(p)) return null
    const pid = nameToId.get(p)!
    if (pid === item.id) return null

    const visited = new Set<string>([item.id])
    let c: string | null = pid
    while (c) {
      if (visited.has(c)) return null
      visited.add(c)
      const row = idToRow.get(c)
      if (!row) break
      const pn = (row.parentName ?? '').trim()
      if (pn === '' || !nameToId.has(pn)) break
      c = nameToId.get(pn)!
    }
    return pid
  }

  const childrenByParentId = new Map<string, FunctionPermissionTreeNode[]>()
  const assignedChildIds = new Set<string>()

  for (const item of flat) {
    const pid = resolveParentId(item)
    if (pid === null) continue
    const node = idToNode.get(item.id)
    if (!node) continue
    const bucket = childrenByParentId.get(pid) ?? []
    bucket.push(node)
    childrenByParentId.set(pid, bucket)
    assignedChildIds.add(item.id)
  }

  for (const [pid, kids] of childrenByParentId) {
    const parent = idToNode.get(pid)
    if (!parent) continue
    parent.child = [...kids].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  }

  const roots: FunctionPermissionTreeNode[] = []
  for (const item of flat) {
    if (!assignedChildIds.has(item.id)) {
      const n = idToNode.get(item.id)
      if (n) roots.push(n)
    }
  }

  return roots.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
}

/** 子樹內所有節點 id（含根） */
export function collectSubtreeIds(root: FunctionPermissionTreeNode): string[] {
  const ids: string[] = [root.id]
  for (const c of root.child) {
    ids.push(...collectSubtreeIds(c))
  }
  return ids
}

export function findTreeNodeById(
  nodes: FunctionPermissionTreeNode[],
  id: string,
): FunctionPermissionTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n
    const found = findTreeNodeById(n.child, id)
    if (found) return found
  }
  return null
}

/**
 * 依扁平資料的 isEnabled，計算該節點子樹的三態：
 * - 葉節點：只看自身 isEnabled
 * - 有子項時：若**所有子孫**皆未勾選 → 父層一律視為 **unchecked**（不因父自身 true 而顯示不定態）
 * - 子樹內全部啟用 → checked
 * - 其餘混合 → indeterminate
 */
export function computeSubtreeTriState(
  node: FunctionPermissionTreeNode,
  enabledById: Map<string, boolean>,
): CheckboxTriState {
  const ids = collectSubtreeIds(node)
  const descendantIds = ids.filter((id) => id !== node.id)

  if (descendantIds.length === 0) {
    return enabledById.get(node.id) ? 'checked' : 'unchecked'
  }

  let descendantsOn = 0
  for (const sid of descendantIds) {
    if (enabledById.get(sid)) descendantsOn++
  }
  if (descendantsOn === 0) return 'unchecked'

  let subtreeOn = 0
  for (const sid of ids) {
    if (enabledById.get(sid)) subtreeOn++
  }
  if (subtreeOn === ids.length) return 'checked'
  return 'indeterminate'
}
