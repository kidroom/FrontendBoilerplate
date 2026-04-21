<script setup lang="ts" generic="T extends string | number">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { FormOption } from '@/types/form-options'

interface Props {
  options: FormOption<T>[]
  modelValue: T | null | undefined
  placeholder?: string
  disabled?: boolean
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const innerClass = computed(() =>
  cn(
    'border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground',
    'focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
    props.class,
  ),
)

function onChange(e: Event) {
  const raw = (e.target as HTMLSelectElement).value
  const match = props.options.find((o) => String(o.value) === raw)
  if (match) emit('update:modelValue', match.value)
}
</script>

<template>
  <select
    :id="id"
    :class="innerClass"
    :disabled="disabled"
    :value="modelValue === null || modelValue === undefined ? '' : String(modelValue)"
    @change="onChange"
  >
    <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
    <option
      v-for="opt in options"
      :key="String(opt.value)"
      :value="String(opt.value)"
      :disabled="opt.disabled"
    >
      {{ opt.label }}
    </option>
  </select>
</template>
