<script setup lang="ts" generic="T extends string | number">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { FormOption } from '@/types/form-options'

interface Props {
  options: FormOption<T>[]
  modelValue: T[]
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  orientation: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: T[]]
}>()

function isChecked(value: T): boolean {
  return props.modelValue.includes(value)
}

function toggle(value: T, checked: boolean) {
  if (props.disabled) return
  const opt = props.options.find((o) => o.value === value)
  if (opt?.disabled) return
  const next = new Set(props.modelValue)
  if (checked) next.add(value)
  else next.delete(value)
  emit('update:modelValue', [...next])
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
    role="group"
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
        type="checkbox"
        class="border-input text-primary focus-visible:ring-ring size-4 shrink-0 rounded-sm border shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
        :checked="isChecked(opt.value)"
        :disabled="disabled || opt.disabled"
        @change="toggle(opt.value, ($event.target as HTMLInputElement).checked)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>
