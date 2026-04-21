<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  /** 標題列文字 */
  title?: string
  /** 一列最多幾欄（響應式時小螢幕仍會自動降為較少欄） */
  columns?: 1 | 2 | 3 | 4
  /** 欄與欄之間、與外框的間距 */
  gap?: 'sm' | 'md' | 'lg'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  title: '查詢條件',
  columns: 2,
  gap: 'md',
})

const gridClass = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  }[props.columns]
  const gapMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }[props.gap]
  return cn('grid w-full items-end', cols, gapMap)
})
</script>

<template>
  <div :class="cn('border-border bg-card rounded-lg border p-4 shadow-sm backdrop-blur', props.class)">
    <p v-if="title" class="text-muted-foreground mb-3 text-sm font-medium">{{ title }}</p>
    <div :class="gridClass">
      <slot />
    </div>
  </div>
</template>
