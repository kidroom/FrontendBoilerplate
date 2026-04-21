<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, unref } from 'vue'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type GridColumns = 1 | 2 | 3 | 4

interface Props {
  /** 表單控制項 id，對應 Label 的 for */
  forId?: string
  label?: string
  /** 標題與控制項：並排或換行 */
  layout?: 'inline' | 'stack'
  class?: HTMLAttributes['class']
  /** 外層欄位寬度，例如 sm:max-w-xs */
  fieldClass?: HTMLAttributes['class']
  /**
   * 在 FilterArea 的 CSS Grid 中橫向佔幾欄。
   * 實際跨度會依父層 FilterArea 的 columns 在各斷點自動上限，避免超出網格。
   */
  columns?: GridColumns
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'stack',
  columns: 1,
})

const filterAreaColumns = inject<ComputedRef<GridColumns> | Ref<GridColumns>>(
  'filterAreaColumns',
  computed(() => 2 as GridColumns)
)

const colSpanClass = computed(() => {
  const f = props.columns
  const a = unref(filterAreaColumns)
  const smGrid: GridColumns = a <= 1 ? 1 : 2
  const lgGrid: GridColumns = a <= 1 ? 1 : a === 2 ? 2 : a === 3 ? 3 : 2
  const xlGrid: GridColumns = a <= 1 ? 1 : a === 2 ? 2 : a === 3 ? 3 : 4
  return cn(
    `col-span-1`,
    `sm:col-span-${Math.min(f, smGrid)}`,
    `lg:col-span-${Math.min(f, lgGrid)}`,
    `xl:col-span-${Math.min(f, xlGrid)}`
  )
})
</script>

<template>
  <div :class="cn('min-w-0', colSpanClass, fieldClass)">
    <div
      :class="
        cn(
          layout === 'inline'
            ? 'flex flex-row flex-wrap items-center gap-x-3 gap-y-1 sm:flex-nowrap'
            : 'grid gap-2',
          props.class
        )
      "
    >
      <Label
        v-if="label"
        :for="forId"
        :class="layout === 'inline' ? 'text-muted-foreground shrink-0 text-sm font-medium' : ''"
      >
        {{ label }}
      </Label>
      <div :class="layout === 'inline' ? 'min-w-0 flex-1' : ''">
        <slot />
      </div>
    </div>
  </div>
</template>
