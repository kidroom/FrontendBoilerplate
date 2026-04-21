<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilterArea, FilterField, QueryResultSection } from '@/components/common'
import { deleteDemoItem, fetchDemoList } from '@/api/demo'
import type { DemoItem } from '@/types/demo'
import type { QueryResultColumnDef } from '@/types/query-result-table'
import { useAppStore } from '@/stores/app'
import { toast } from '@/composables/useToast'

type DemoRow = DemoItem & Record<string, unknown>

const router = useRouter()
const app = useAppStore()

const q = ref('')
const page = ref(1)
const pageSize = ref(5)
const sortField = ref<'name' | 'updatedAt'>('updatedAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const items = ref<DemoItem[]>([])
const total = ref(0)

const confirmOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

const tableRows = computed(() => items.value as DemoRow[])

const columns: QueryResultColumnDef<DemoRow>[] = [
  {
    key: 'name',
    title: '名稱',
    headerAlign: 'left',
    cellAlign: 'left',
    type: 'text',
    sortable: true,
    sortField: 'name',
  },
  {
    key: 'status',
    title: '狀態',
    headerAlign: 'left',
    cellAlign: 'left',
    type: 'text',
    format: (row) => (row.status === 'active' ? '啟用' : '草稿'),
  },
  {
    key: 'updatedAt',
    title: '更新時間',
    headerAlign: 'left',
    cellAlign: 'left',
    type: 'text',
    sortable: true,
    sortField: 'updatedAt',
    format: (_row, v) => (v ? new Date(String(v)).toLocaleString() : ''),
  },
  {
    key: '_actions',
    title: '操作',
    headerAlign: 'right',
    cellAlign: 'right',
    type: 'button',
    buttons: [
      { id: 'detail', label: '詳情', variant: 'outline' },
      { id: 'edit', label: '編輯', variant: 'outline' },
      { id: 'delete', label: '刪除', variant: 'destructive' },
    ],
  },
]

async function load() {
  app.setPageLoading(true)
  try {
    const res = await fetchDemoList({
      q: q.value,
      page: page.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    })
    items.value = res.items
    total.value = res.total
  } finally {
    app.setPageLoading(false)
  }
}

onMounted(() => {
  void load()
})

watch([page, pageSize, sortField, sortOrder], () => {
  void load()
})

function onSearch() {
  page.value = 1
  void load()
}

function toggleSort(field: 'name' | 'updatedAt') {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

function onColumnSort(field: string) {
  if (field === 'name' || field === 'updatedAt') {
    toggleSort(field)
  }
}

function onCellAction(payload: { row: DemoRow; columnKey: string; actionId: string }) {
  const { row, actionId } = payload
  if (actionId === 'detail') {
    void router.push({ name: 'demo-detail', params: { id: row.id } })
    return
  }
  if (actionId === 'edit') {
    void router.push({ name: 'demo-edit', params: { id: row.id } })
    return
  }
  if (actionId === 'delete') {
    openDelete(row.id)
  }
}

function openDelete(id: string) {
  pendingDeleteId.value = id
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return
  const ok = await deleteDemoItem(pendingDeleteId.value)
  pendingDeleteId.value = null
  confirmOpen.value = false
  if (ok) {
    toast.success('已刪除')
    void load()
  } else {
    toast.error('刪除失敗')
  }
}
</script>

<template>
  <div>
    <FilterArea class="mb-4" title="查詢條件" :columns="2">
      <FilterField for-id="demo-q" label="關鍵字（名稱）" layout="stack" field-class="sm:max-w-xs" :columns="2">
        <Input id="demo-q" v-model="q" placeholder="輸入關鍵字" @keyup.enter="onSearch" />
      </FilterField>
      <div class="flex flex-wrap items-end gap-2">
        <Button type="button" @click="onSearch">查詢</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'demo-create' })">
          新增
        </Button>
      </div>
    </FilterArea>

    <QueryResultSection
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="total"
      :columns="columns"
      :rows="tableRows"
      :active-sort-field="sortField"
      :sort-order="sortOrder"
      :show-range="true"
      :show-page-size="true"
      :page-size-options="[5, 10, 20, 50, 100]"
      :show-page-numbers="true"
      @sort="onColumnSort"
      @cell-action="onCellAction"
    />

    <AlertDialog v-model:open="confirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定刪除？</AlertDialogTitle>
          <AlertDialogDescription>此動作無法還原（模板假資料將自記憶體移除）。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">刪除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
