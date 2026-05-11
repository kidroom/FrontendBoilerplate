<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Check, Minus } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { CheckboxTriState } from '@/types/auth'

interface Props {
  /** 視覺狀態；不定態僅能由父層依資料指定，使用者點擊不會把狀態「停」在不定態 */
  state: CheckboxTriState
  disabled?: boolean
  id?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  /** 點擊後的勾選結果：僅 `true`／`false`，永遠不會是 indeterminate */
  commit: [checked: boolean]
}>()

/** 由目前 state 推導「下一次點擊」應送出的 boolean（不定態 → true） */
function nextCommittedChecked(): boolean {
  if (props.state === 'checked') return false
  return true
}

function onClick() {
  if (props.disabled) return
  emit('commit', nextCommittedChecked())
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    emit('commit', nextCommittedChecked())
  }
}
</script>

<template>
  <button
    :id="props.id"
    type="button"
    role="checkbox"
    :aria-checked="state === 'indeterminate' ? 'mixed' : state === 'checked'"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    :class="
      cn(
        'border-input focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-[transform,colors] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        state === 'checked' && 'bg-primary text-primary-foreground border-primary',
        state === 'indeterminate' && 'bg-primary text-primary-foreground border-primary',
        state === 'unchecked' && 'bg-background',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.97]',
        props.class,
      )
    "
    @click="onClick"
    @keydown="onKeydown"
  >
    <Check v-if="state === 'checked'" class="size-3 stroke-[3]" aria-hidden="true" />
    <Minus v-else-if="state === 'indeterminate'" class="size-3 stroke-[2.5]" aria-hidden="true" />
  </button>
</template>
