<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import DataPagination from '@/components/common/DataPagination.vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { resolveQueryTableIcon } from '@/utils/query-table-icons'
import type { DataPaginationDisplayOptions } from '@/types/pagination-controls'
import type { QueryColumnAlign, QueryResultColumnDef } from '@/types/query-result-table'

interface Props extends DataPaginationDisplayOptions {
  total: number
  page: number
  pageSize: number
  /** 欄位定義；有資料時依 rows 自動對應。為空則改以 slot 自行渲染表格 */
  columns?: QueryResultColumnDef<T>[]
  rows?: T[]
  /** 列唯一鍵；預設 `id` */
  rowKey?: keyof T | ((row: T) => string)
  emptyText?: string
  minTableWidth?: string
  /** checkbox 欄位用：已選列的 key 清單 */
  selectedKeys?: string[]
  /** 外層查詢結果區塊 class */
  class?: HTMLAttributes['class']
  /** 包住表格的容器 class（預設含 overflow-x-auto） */
  tableWrapClass?: HTMLAttributes['class']
  /** 與後端 sort 欄位一致時，可排序表頭顯示排序方向 */
  activeSortField?: string
  sortOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  rows: () => [],
  rowKey: 'id',
  emptyText: '沒有資料',
  minTableWidth: '640px',
  showRange: false,
  showFirstLast: false,
  showPageNumbers: false,
  navButtonVariant: 'icon',
  showJump: false,
  jumpStyle: 'select',
  showPageSize: false,
  pageSizeOptions: () => [10, 20, 50, 100],
})

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
  'update:selectedKeys': [value: string[]]
  /** 點擊可排序表頭 */
  sort: [field: string]
  /** type=button 儲存格內按鈕 */
  cellAction: [payload: { row: T; columnKey: string; actionId: string }]
}>()

const pageVm = useVModel(props, 'page', emit)
const pageSizeVm = useVModel(props, 'pageSize', emit)

/** 未使用 v-model:selectedKeys 時的內部選取狀態 */
const selectedKeysInternal = ref<string[]>([])

const selectedKeysList = computed(() => props.selectedKeys ?? selectedKeysInternal.value)

const useDataTable = computed(() => props.columns.length > 0)

function alignClass(align?: QueryColumnAlign): string {
  switch (align ?? 'left') {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}

function flexJustifyClass(align?: QueryColumnAlign): string {
  switch (align ?? 'left') {
    case 'center':
      return 'justify-center'
    case 'right':
      return 'justify-end'
    default:
      return 'justify-start'
  }
}

function getValue(row: T, key: string): unknown {
  const parts = key.split('.')
  let cur: unknown = row
  for (const p of parts) {
    if (cur !== null && typeof cur === 'object' && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return undefined
    }
  }
  return cur
}

function getRowKey(row: T): string {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  const k = props.rowKey as keyof T
  const v = row[k]
  return v !== undefined && v !== null ? String(v) : ''
}

function displayText(col: QueryResultColumnDef<T>, row: T): string {
  const v = getValue(row, col.key)
  if (col.format) return col.format(row, v)
  if (v === null || v === undefined) return ''
  return String(v)
}

function onSort(col: QueryResultColumnDef<T>) {
  if (!col.sortable) return
  const field = col.sortField ?? col.key
  emit('sort', field)
}

function onButton(
  row: T,
  columnKey: string,
  actionId: string,
  e: Event,
) {
  e.preventDefault()
  emit('cellAction', { row, columnKey, actionId })
}

function isRowChecked(row: T, col: QueryResultColumnDef<T>): boolean {
  if (col.getChecked) return col.getChecked(row)
  return selectedKeysList.value.includes(getRowKey(row))
}

function toggleRowCheck(row: T, checked: boolean) {
  const key = getRowKey(row)
  const next = new Set(selectedKeysList.value)
  if (checked) next.add(key)
  else next.delete(key)
  const arr = [...next]
  if (props.selectedKeys !== undefined) {
    emit('update:selectedKeys', arr)
  } else {
    selectedKeysInternal.value = arr
  }
}
</script>

<template>
  <div :class="cn('space-y-4', props.class)">
    <div :class="cn('overflow-x-auto rounded-lg border bg-card shadow-sm backdrop-blur', tableWrapClass)">
      <template v-if="useDataTable">
        <table
          class="w-full text-left text-sm"
          :style="{ minWidth: minTableWidth }"
        >
          <thead>
            <tr class="border-b bg-muted/50">
              <th
                v-for="col in columns"
                :key="col.key"
                class="text-foreground px-3 py-2 align-middle font-medium"
                :class="alignClass(col.headerAlign)"
              >
                <button
                  v-if="col.sortable"
                  type="button"
                  class="hover:text-foreground inline-flex w-full items-center gap-1 font-medium"
                  :class="[alignClass(col.headerAlign), flexJustifyClass(col.headerAlign)]"
                  @click="onSort(col)"
                >
                  {{ col.title }}
                  <span
                    v-if="activeSortField === (col.sortField ?? col.key)"
                    class="text-muted-foreground text-xs"
                  >
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </button>
                <span v-else>{{ col.title }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in rows"
              :key="getRowKey(row) || String(rowIndex)"
              class="border-b border-border last:border-0"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                class="text-foreground px-3 py-2 align-middle"
                :class="alignClass(col.cellAlign)"
              >
                <!-- text -->
                <template v-if="(col.type ?? 'text') === 'text'">
                  <span>{{ displayText(col, row) }}</span>
                </template>

                <!-- button -->
                <template v-else-if="col.type === 'button'">
                  <div
                    class="flex flex-wrap gap-2"
                    :class="flexJustifyClass(col.cellAlign)"
                  >
                    <Button
                      v-for="btn in col.buttons"
                      :key="btn.id"
                      type="button"
                      size="sm"
                      :variant="btn.variant ?? 'outline'"
                      @click="onButton(row, col.key, btn.id, $event)"
                    >
                      {{ btn.label }}
                    </Button>
                  </div>
                </template>

                <!-- checkbox -->
                <template v-else-if="col.type === 'checkbox'">
                  <input
                    type="checkbox"
                    class="border-input text-primary focus-visible:ring-ring size-4 rounded-sm border shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    :checked="isRowChecked(row, col)"
                    @change="toggleRowCheck(row, ($event.target as HTMLInputElement).checked)"
                  />
                </template>

                <!-- image -->
                <template v-else-if="col.type === 'image'">
                  <img
                    v-if="col.imageSrc"
                    :src="col.imageSrc(row, getValue(row, col.key))"
                    :alt="col.imageAlt ? col.imageAlt(row) : ''"
                    class="inline-block h-10 max-w-[120px] rounded object-cover"
                  />
                </template>

                <!-- icon -->
                <template v-else-if="col.type === 'icon'">
                  <span
                    class="text-muted-foreground inline-flex items-center gap-2"
                    :class="flexJustifyClass(col.cellAlign)"
                  >
                    <component
                      :is="resolveQueryTableIcon(col.iconName)"
                      v-if="resolveQueryTableIcon(col.iconName)"
                      class="size-4 shrink-0"
                    />
                    <span v-if="displayText(col, row)">{{ displayText(col, row) }}</span>
                  </span>
                </template>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td
                :colspan="Math.max(1, columns.length)"
                class="text-muted-foreground px-3 py-8 text-center align-middle"
              >
                {{ emptyText }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <slot v-else />
    </div>

    <DataPagination
      v-model:page="pageVm"
      v-model:page-size="pageSizeVm"
      :total="total"
      :show-range="showRange"
      :show-first-last="showFirstLast"
      :show-page-numbers="showPageNumbers"
      :nav-button-variant="navButtonVariant"
      :show-jump="showJump"
      :jump-style="jumpStyle"
      :show-page-size="showPageSize"
      :page-size-options="pageSizeOptions"
    />
  </div>
</template>
