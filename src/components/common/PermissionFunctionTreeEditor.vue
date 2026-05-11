<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { Inbox } from 'lucide-vue-next'
import type { CheckboxTriState, FunctionPermissionInfo } from '@/types/auth'
import { cn } from '@/lib/utils'
import {
  buildFunctionPermissionTree,
  collectSubtreeIds,
  computeSubtreeTriState,
  findTreeNodeById,
} from '@/utils/functionPermissionTree'
import PermissionFunctionTreeBranch from './PermissionFunctionTreeBranch.vue'
import { permissionFunctionTreeKey } from './permissionFunctionTreeContext'

interface Props {
  modelValue: FunctionPermissionInfo[]
  /** 外層容器額外 class */
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FunctionPermissionInfo[]]
}>()

const tree = computed(() => buildFunctionPermissionTree(props.modelValue))

const totalCount = computed(() => props.modelValue.length)
const enabledCount = computed(() => props.modelValue.filter((x) => x.isEnabled).length)
const rootWithChildren = computed(() => tree.value.filter((n) => n.child.length > 0).length)

const triStateById = computed(() => {
  const list = props.modelValue
  if (list.length === 0) return new Map<string, CheckboxTriState>()
  const enabledById = new Map(list.map((x) => [x.id, x.isEnabled]))
  const built = buildFunctionPermissionTree(list)
  const m = new Map<string, CheckboxTriState>()
  function walk(nodes: typeof built) {
    for (const n of nodes) {
      m.set(n.id, computeSubtreeTriState(n, enabledById))
      walk(n.child)
    }
  }
  walk(built)
  return m
})

const expandedById = ref<Record<string, boolean>>({})
const expandInitApplied = ref(false)

watch(
  () => props.modelValue,
  (list) => {
    if (list.length === 0) {
      expandedById.value = {}
      expandInitApplied.value = false
      return
    }
    if (expandInitApplied.value) return
    expandInitApplied.value = true
    const enabledById = new Map(list.map((x) => [x.id, x.isEnabled]))
    const built = buildFunctionPermissionTree(list)
    const next: Record<string, boolean> = {}
    function walk(nodes: typeof built) {
      for (const n of nodes) {
        if (n.child.length > 0) {
          next[n.id] = computeSubtreeTriState(n, enabledById) === 'indeterminate'
          walk(n.child)
        }
      }
    }
    walk(built)
    expandedById.value = next
  },
  { immediate: true },
)

function toggleExpand(id: string) {
  const cur = expandedById.value[id] ?? false
  expandedById.value = { ...expandedById.value, [id]: !cur }
}

provide(permissionFunctionTreeKey, {
  triStateById,
  expandedById,
  toggleExpand,
})

function onCommitCheck(id: string, checked: boolean) {
  const built = buildFunctionPermissionTree(props.modelValue)
  const node = findTreeNodeById(built, id)
  if (!node) return
  const ids = new Set(collectSubtreeIds(node))
  const next = props.modelValue.map((row) => (ids.has(row.id) ? { ...row, isEnabled: checked } : row))
  emit('update:modelValue', next)
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div
      v-if="modelValue.length === 0"
      class="border-border bg-muted/30 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center"
    >
      <Inbox class="text-muted-foreground/50 mb-3 size-11 stroke-[1.25]" aria-hidden="true" />
      <p class="text-foreground text-sm font-medium">尚無功能節點</p>
      <p class="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
        後端未回傳任何資料，或此角色尚未設定功能項目。
      </p>
    </div>

    <div
      v-else
      class="border-border bg-muted/20 overflow-hidden rounded-xl border shadow-xs"
    >
      <div
        class="border-border from-muted/60 to-muted/30 flex flex-wrap items-center gap-3 border-b bg-gradient-to-r px-4 py-3 sm:px-5"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2.5">
          <div class="min-w-0">
            <p class="text-foreground text-sm font-semibold tracking-tight">權限樹狀檢視</p>
            <p class="text-muted-foreground mt-0.5 text-xs leading-snug">
              共 <span class="text-foreground font-medium tabular-nums">{{ totalCount }}</span> 項
              <span class="text-border mx-1.5" aria-hidden="true">·</span>
              已啟用
              <span class="text-primary font-semibold tabular-nums">{{ enabledCount }}</span>
              項
              <template v-if="rootWithChildren > 0">
                <span class="text-border mx-1.5" aria-hidden="true">·</span>
                {{ rootWithChildren }} 個分組含子項
              </template>
            </p>
          </div>
        </div>
      </div>

      <div
        class="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain px-2 py-3 [scrollbar-width:thin] sm:px-3 sm:py-4"
      >
        <ul class="space-y-1" role="tree">
          <PermissionFunctionTreeBranch
            v-for="n in tree"
            :key="n.id"
            :node="n"
            :depth="0"
            @commit-check="onCommitCheck"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
