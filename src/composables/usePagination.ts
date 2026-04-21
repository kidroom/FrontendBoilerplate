import { computed, type ComputedRef, type Ref, isRef, unref } from 'vue'

export interface PaginationRange {
  /** 目前頁面第一筆在總資料中的序號（1-based） */
  from: number
  /** 目前頁面最後一筆在總資料中的序號（1-based） */
  to: number
  /** 總筆數 */
  total: number
}

const DEFAULT_WINDOW = 10

/**
 * 分頁數字視窗：總頁數 > windowSize 時，讓目前頁落在約第 5 個位置（與規格 1~5 顯示 1~10、第 6 頁顯示 2~11 一致）。
 */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  windowSize: number = DEFAULT_WINDOW,
): number[] {
  if (totalPages <= 0) return []
  const W = Math.min(windowSize, totalPages)
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const anchor = 5
  let start = currentPage - (anchor - 1)
  start = Math.max(1, Math.min(start, totalPages - W + 1))
  const end = start + W - 1
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function getPaginationRange(
  page: number,
  pageSize: number,
  total: number,
): PaginationRange {
  if (total <= 0) {
    return { from: 0, to: 0, total: 0 }
  }
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return { from, to, total }
}

export interface UsePaginationOptions {
  page: Ref<number> | number
  pageSize: Ref<number> | number
  total: Ref<number> | number
}

export interface UsePaginationReturn {
  totalPages: ComputedRef<number>
  range: ComputedRef<PaginationRange>
  visiblePages: ComputedRef<number[]>
  setPage: (p: number) => void
  windowSize: number
}

/**
 * 與 DataPagination 共用的分頁計算（頁面也可單獨使用 range / visiblePages）。
 */
export function usePagination(
  options: UsePaginationOptions,
  windowSize: number = DEFAULT_WINDOW,
): UsePaginationReturn {
  const totalPages = computed(() => {
    const total = unref(options.total)
    const ps = unref(options.pageSize)
    if (total <= 0 || ps <= 0) return 0
    return Math.ceil(total / ps)
  })

  const range = computed(() =>
    getPaginationRange(unref(options.page), unref(options.pageSize), unref(options.total)),
  )

  const visiblePages = computed(() =>
    getVisiblePageNumbers(unref(options.page), totalPages.value, windowSize),
  )

  function setPage(p: number) {
    const max = totalPages.value
    if (max <= 0) return
    const next = Math.max(1, Math.min(p, max))
    if (isRef(options.page)) {
      options.page.value = next
    }
  }

  return {
    totalPages,
    range,
    visiblePages,
    setPage,
    windowSize,
  }
}
