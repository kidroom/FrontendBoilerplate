<script setup lang="ts" generic="T extends string | number">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { FormOption } from '@/types/form-options'

interface Props {
  options: FormOption<T>[]
  modelValue: T | null | undefined
  /** 同一組 radio 的 name，需唯一 */
  name: string
  disabled?: boolean
  /** 排列方向 */
  orientation?: 'horizontal' | 'vertical'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  orientation: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

function onPick(value: T) {
  if (props.disabled) return
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    :class="
      cn(
        orientation === 'horizontal'
          ? 'flex flex-wrap items-center gap-x-4 gap-y-2'
          : 'flex flex-col gap-2',
        props.class,
      )
    "
    role="radiogroup"
  >
    <label
      v-for="opt in options"
      :key="String(opt.value)"
      :class="
        cn(
          'flex cursor-pointer items-center gap-2 text-sm',
          (disabled || opt.disabled) && 'cursor-not-allowed opacity-50',
        )
      "
    >
      <input
        type="radio"
        class="border-input text-primary focus-visible:ring-ring size-4 shrink-0 rounded-full border shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
        :name="name"
        :value="String(opt.value)"
        :checked="modelValue === opt.value"
        :disabled="disabled || opt.disabled"
        @change="onPick(opt.value)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>
