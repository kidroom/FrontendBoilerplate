<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Props {
  /** 表單控制項 id，對應 Label 的 for */
  forId?: string
  label?: string
  /** 標題與控制項：並排或換行 */
  layout?: 'inline' | 'stack'
  class?: HTMLAttributes['class']
  /** 外層欄位寬度，例如 sm:max-w-xs */
  fieldClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'stack',
})
</script>

<template>
  <div :class="cn('min-w-0', fieldClass)">
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
