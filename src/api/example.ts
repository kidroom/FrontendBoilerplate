import { http } from '@/utils/http'

/** 範例：請依後端契約定義回傳型別與路徑 */
export async function fetchHealth(): Promise<{ ok: boolean }> {
  const { data } = await http.get<{ ok: boolean }>('/health')
  return data
}
