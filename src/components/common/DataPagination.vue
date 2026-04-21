<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { getPaginationRange, getVisiblePageNumbers } from '@/composables/usePagination'

interface Props {
  page: number
  pageSize: number
  total: number
  showRange?: boolean
  showFirstLast?: boolean
  showPageNumbers?: boolean
  navButtonVariant?: 'icon' | 'text'
  showJump?: boolean
  jumpStyle?: 'select' | 'input'
  showPageSize?: boolean
  pageSizeOptions?: number[]
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
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
}>()

const pageVm = useVModel(props, 'page', emit)
const pageSizeVm = useVModel(props, 'pageSize', emit)

const totalPages = computed(() => {
  if (props.total <= 0 || props.pageSize <= 0) return 0
  return Math.ceil(props.total / props.pageSize)
})

/** 規則 2.5：僅一頁資料時不顯示分頁區塊 */
const showPagination = computed(() => totalPages.value > 1)

const range = computed(() =>
  getPaginationRange(pageVm.value, pageSizeVm.value, props.total),
)

const visiblePages = computed(() =>
  getVisiblePageNumbers(pageVm.value, totalPages.value, 10),
)

const jumpInput = ref(String(pageVm.value))

watch(pageVm, (p) => {
  jumpInput.value = String(p)
})

watch([totalPages, () => props.total], () => {
  if (totalPages.value > 0 && pageVm.value > totalPages.value) {
    pageVm.value = totalPages.value
  }
})

/** 每頁筆數變更時回到第一頁，避免頁碼超出總頁數（規則 2.5） */
watch(
  () => pageSizeVm.value,
  (next, prev) => {
    if (prev === undefined) return
    if (next !== prev && totalPages.value > 0) {
      pageVm.value = 1
    }
  },
)

function goFirst() {
  pageVm.value = 1
}
function goPrev() {
  pageVm.value = Math.max(1, pageVm.value - 1)
}
function goNext() {
  pageVm.value = Math.min(totalPages.value, pageVm.value + 1)
}
function goLast() {
  pageVm.value = totalPages.value
}
function goPage(p: number) {
  pageVm.value = p
}

function onJumpSelect(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  if (!Number.isNaN(v)) pageVm.value = v
}

function onJumpSubmit() {
  const v = Number.parseInt(jumpInput.value, 10)
  if (Number.isNaN(v)) return
  const max = totalPages.value
  if (max <= 0) return
  pageVm.value = Math.max(1, Math.min(v, max))
}

function onPageSizeSelect(e: Event) {
  const v = Number((e.target as HTMLSelectElement).value)
  if (!Number.isNaN(v)) pageSizeVm.value = v
}

const navDisabled = computed(() => totalPages.value <= 0)

/** 下拉選單含目前筆數，避免 v-model 與選項不一致 */
const pageSizeSelectOptions = computed(() => {
  const raw = props.pageSizeOptions
  const set = new Set(raw)
  set.add(pageSizeVm.value)
  return [...set].sort((a, b) => a - b)
})

const selectClass = cn(
  'border-input bg-background text-foreground ring-offset-background',
  'focus-visible:ring-ring flex h-9 min-w-[4.5rem] rounded-md border px-3 py-1 text-sm shadow-xs',
  'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
)
</script>

<template>
  <div
    :class="
      cn(
        'text-muted-foreground flex flex-col flex-wrap gap-3 text-sm sm:flex-row sm:items-center',
        showRange ? 'sm:justify-between' : 'sm:justify-end',
        props.class,
      )
    "
  >
    <p v-if="showRange">
      共 {{ range.total }} 筆；目前第 {{ range.from }} ~ {{ range.to }} 筆
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <template v-if="showPageSize">
        <span class="text-muted-foreground shrink-0">每頁</span>
        <select
          :class="selectClass"
          :value="pageSizeVm"
          aria-label="每頁筆數"
          @change="onPageSizeSelect"
        >
          <option v-for="n in pageSizeSelectOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        <span class="text-muted-foreground shrink-0">筆</span>
      </template>

      <template v-if="showJump">
        <template v-if="jumpStyle === 'select' && totalPages > 0">
          <span class="text-muted-foreground shrink-0">前往</span>
          <select
            :class="selectClass"
            :value="pageVm"
            aria-label="選擇頁碼"
            @change="onJumpSelect"
          >
            <option v-for="p in totalPages" :key="p" :value="p">{{ p }}</option>
          </select>
          <span class="text-muted-foreground shrink-0">頁</span>
        </template>
        <template v-else-if="jumpStyle === 'input' && totalPages > 0">
          <span class="text-muted-foreground shrink-0">前往</span>
          <Input
            v-model="jumpInput"
            class="h-9 w-16 text-center"
            type="text"
            inputmode="numeric"
            aria-label="輸入頁碼"
            @keydown.enter.prevent="onJumpSubmit"
          />
          <Button type="button" size="sm" variant="outline" @click="onJumpSubmit">確定</Button>
        </template>
      </template>

      <div
       v-if="showPagination"
       class="flex flex-wrap items-center gap-1"
      >
        <Button
          v-if="showFirstLast"
          type="button"
          size="sm"
          variant="outline"
          :disabled="navDisabled || pageVm <= 1"
          class="shrink-0"
          aria-label="第一頁"
          @click="goFirst"
        >
          <ChevronsLeft v-if="navButtonVariant === 'icon'" class="size-4" />
          <span v-else>第一頁</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          :disabled="navDisabled || pageVm <= 1"
          class="shrink-0"
          aria-label="上一頁"
          @click="goPrev"
        >
          <ChevronLeft v-if="navButtonVariant === 'icon'" class="size-4" />
          <span v-else>上一頁</span>
        </Button>

        <template v-if="showPageNumbers && totalPages > 0">
          <Button
            v-for="p in visiblePages"
            :key="p"
            type="button"
            size="sm"
            :variant="p === pageVm ? 'default' : 'outline'"
            class="min-w-9 shrink-0 px-2"
            @click="goPage(p)"
          >
            {{ p }}
          </Button>
        </template>

        <Button
          type="button"
          size="sm"
          variant="outline"
          :disabled="navDisabled || pageVm >= totalPages"
          class="shrink-0"
          aria-label="下一頁"
          @click="goNext"
        >
          <ChevronRight v-if="navButtonVariant === 'icon'" class="size-4" />
          <span v-else>下一頁</span>
        </Button>
        <Button
          v-if="showFirstLast"
          type="button"
          size="sm"
          variant="outline"
          :disabled="navDisabled || pageVm >= totalPages"
          class="shrink-0"
          aria-label="最後一頁"
          @click="goLast"
        >
          <ChevronsRight v-if="navButtonVariant === 'icon'" class="size-4" />
          <span v-else>最後一頁</span>
        </Button>
      </div>
    </div>
  </div>
</template>
