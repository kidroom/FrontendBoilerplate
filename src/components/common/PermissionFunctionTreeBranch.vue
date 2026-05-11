<script setup lang="ts">
import { computed, inject } from 'vue'
import { ChevronRight, Folder, Hash } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FunctionPermissionTreeNode } from '@/types/auth'
import PermissionFunctionTreeBranch from './PermissionFunctionTreeBranch.vue'
import { permissionFunctionTreeKey } from './permissionFunctionTreeContext'
import TriStateCheckbox from './TriStateCheckbox.vue'

interface Props {
  node: FunctionPermissionTreeNode
  depth?: number
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
})

const emit = defineEmits<{
  'commit-check': [id: string, checked: boolean]
}>()

const ctx = inject(permissionFunctionTreeKey)
if (!ctx) {
  throw new Error('PermissionFunctionTreeBranch must be used inside PermissionFunctionTreeEditor')
}

const triState = computed(() => ctx.triStateById.value.get(props.node.id) ?? 'unchecked')
const expanded = computed(() => ctx.expandedById.value[props.node.id] ?? false)

const childCount = computed(() => props.node.child.length)
const isBranch = computed(() => childCount.value > 0)

const rowHighlightClass = computed(() => {
  if (triState.value === 'checked') {
    return 'border-primary/15 bg-primary/[0.06] hover:border-primary/25'
  }
  if (triState.value === 'indeterminate') {
    return 'border-amber-500/35 bg-amber-500/[0.06] hover:border-amber-500/45'
  }
  return ''
})
</script>

<template>
  <li class="list-none" role="treeitem" :aria-expanded="isBranch ? expanded : undefined">
    <div
      :class="
        cn(
          'group flex flex-wrap items-center gap-2 rounded-lg border border-transparent px-2 py-2 transition-[background-color,box-shadow,border-color] sm:gap-3 sm:px-3 sm:py-2.5',
          'hover:bg-muted/70 hover:border-border/90 hover:shadow-xs',
          depth === 0 && 'bg-background/40',
          rowHighlightClass,
        )
      "
    >
      <button
        v-if="isBranch"
        type="button"
        class="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md transition-colors"
        :aria-expanded="expanded"
        :aria-label="expanded ? '收合子項目' : '展開子項目'"
        @click.stop="ctx.toggleExpand(node.id)"
      >
        <ChevronRight
          class="size-4 transition-transform duration-200"
          :class="expanded ? 'rotate-90' : ''"
          aria-hidden="true"
        />
      </button>
      <span
        v-else
        class="size-8 shrink-0"
        aria-hidden="true"
      />
      <TriStateCheckbox
        :id="`fn-${node.id}`"
        :state="triState"
        @commit="(checked) => emit('commit-check', node.id, checked)"
      />
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Label
            :for="`fn-${node.id}`"
            class="text-foreground cursor-pointer text-sm font-medium leading-snug tracking-tight"
          >
            {{ node.name }}
          </Label>
          <span
            v-if="isBranch"
            class="text-muted-foreground bg-muted/50 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums"
          >
            {{ childCount }} 項子功能
          </span>
        </div>
      </div>
    </div>
    <ul
      v-if="isBranch"
      v-show="expanded"
      class="border-border/60 relative mt-1.5 space-y-1 border-l-2 border-dashed pl-3 sm:mt-2 sm:pl-4"
      role="group"
    >
      <PermissionFunctionTreeBranch
        v-for="c in node.child"
        :key="c.id"
        :node="c"
        :depth="depth + 1"
        @commit-check="(id, checked) => emit('commit-check', id, checked)"
      />
    </ul>
  </li>
</template>
