import type { ApiListResponse } from '@/types/api'
import type { DemoItem, DemoListQuery } from '@/types/demo'

/** 本地假資料：後端就緒後請改為 `http.get` 並對齊契約 */
const MOCK_DB: DemoItem[] = [
  { id: '1', name: '範例項目 A', status: 'active', updatedAt: '2026-04-01T10:00:00.000Z' },
  { id: '2', name: '範例項目 B', status: 'draft', updatedAt: '2026-04-02T14:30:00.000Z' },
  { id: '3', name: '範例項目 C', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '4', name: '範例項目 D', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '5', name: '範例項目 E', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '6', name: '範例項目 F', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '7', name: '範例項目 G', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '8', name: '範例項目 H', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '9', name: '範例項目 I', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '10', name: '範例項目 J', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '11', name: '範例項目 K', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '12', name: '範例項目 L', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '14', name: '範例項目 M', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
  { id: '15', name: '範例項目 N', status: 'active', updatedAt: '2026-04-03T09:15:00.000Z' },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchDemoList(query: DemoListQuery): Promise<ApiListResponse<DemoItem>> {
  await delay(280)
  let list = [...MOCK_DB]
  const q = query.q.trim().toLowerCase()
  if (q) {
    list = list.filter((row) => row.name.toLowerCase().includes(q))
  }
  const mult = query.sortOrder === 'asc' ? 1 : -1
  list.sort((a, b) => {
    const av = query.sortField === 'name' ? a.name : a.updatedAt
    const bv = query.sortField === 'name' ? b.name : b.updatedAt
    return av < bv ? -mult : av > bv ? mult : 0
  })
  const total = list.length
  const start = (query.page - 1) * query.pageSize
  const items = list.slice(start, start + query.pageSize)
  return { items, total }
}

export async function fetchDemoById(id: string): Promise<DemoItem | null> {
  await delay(200)
  return MOCK_DB.find((row) => row.id === id) ?? null
}

export async function createDemoItem(payload: Pick<DemoItem, 'name' | 'status'>): Promise<DemoItem> {
  await delay(300)
  const row: DemoItem = {
    id: globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`,
    name: payload.name,
    status: payload.status,
    updatedAt: new Date().toISOString(),
  }
  MOCK_DB.unshift(row)
  return row
}

export async function updateDemoItem(
  id: string,
  payload: Pick<DemoItem, 'name' | 'status'>,
): Promise<DemoItem | null> {
  await delay(300)
  const row = MOCK_DB.find((r) => r.id === id)
  if (!row) return null
  row.name = payload.name
  row.status = payload.status
  row.updatedAt = new Date().toISOString()
  return row
}

export async function deleteDemoItem(id: string): Promise<boolean> {
  await delay(250)
  const i = MOCK_DB.findIndex((r) => r.id === id)
  if (i === -1) return false
  MOCK_DB.splice(i, 1)
  return true
}