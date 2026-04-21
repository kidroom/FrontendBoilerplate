<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, useId, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Props {
  modelValue: File | File[] | null
  /** 是否顯示標題 Label */
  showLabel?: boolean
  label?: string
  /** 對應唯讀檔名輸入框 id */
  inputId?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** 選擇檔案按鈕文字 */
  buttonText?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  label: '上傳檔案',
  multiple: false,
  disabled: false,
  buttonText: '選擇檔案',
})

const emit = defineEmits<{
  'update:modelValue': [value: File | File[] | null]
}>()

const uid = useId()
const inputId = computed(() => props.inputId ?? `file-upload-${uid}`)
const fileInputRef = ref<HTMLInputElement | null>(null)

const displayName = ref('')

watch(
  () => props.modelValue,
  (v) => {
    if (!v) {
      displayName.value = ''
      return
    }
    if (Array.isArray(v)) {
      displayName.value = v.map((f) => f.name).join(', ')
    } else {
      displayName.value = v.name
    }
  },
  { immediate: true },
)

function openPicker() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const el = e.target as HTMLInputElement
  const files = el.files
  if (!files?.length) {
    emit('update:modelValue', null)
    displayName.value = ''
    return
  }
  if (props.multiple) {
    const list = Array.from(files)
    emit('update:modelValue', list)
    displayName.value = list.map((f) => f.name).join(', ')
  } else {
    const f = files[0]
    emit('update:modelValue', f)
    displayName.value = f.name
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3', props.class)">
    <Label v-if="showLabel" :for="inputId" class="text-sm font-medium sm:shrink-0 sm:pt-2">
      {{ label }}
    </Label>
    <input
      ref="fileInputRef"
      type="file"
      class="sr-only"
      tabindex="-1"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      aria-hidden="true"
      @change="onFileChange"
    />
    <Input
      :id="inputId"
      type="text"
      readonly
      tabindex="-1"
      :model-value="displayName"
      placeholder="尚未選擇檔案"
      class="min-w-0 flex-1"
      :disabled="disabled"
      aria-readonly="true"
    />
    <Button type="button" variant="outline" :disabled="disabled" class="shrink-0" @click="openPicker">
      {{ buttonText }}
    </Button>
  </div>
</template>
