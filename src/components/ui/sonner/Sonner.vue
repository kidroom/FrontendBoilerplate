<script lang="ts" setup>
import { computed } from 'vue'
import type { ToasterProps } from 'vue-sonner'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from 'lucide-vue-next'
import { Toaster as Sonner } from 'vue-sonner'
import { defaultToasterProps, defaultToastOptions } from '@/config/toaster'
import { cn } from '@/lib/utils'

const props = defineProps<ToasterProps>()

const mergedToastOptions = computed(() => ({
  ...defaultToastOptions,
  ...props.toastOptions,
}))

/** 未傳入的選用 prop 為 `undefined`，若直接展開會覆寫 defaultToasterProps（例如 position → 套件改回 bottom-right） */
function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}

const passthrough = computed((): ToasterProps => {
  const { class: _class, style: _style, ...rest } = props
  const definedRest = omitUndefined(rest as Record<string, unknown>)
  return {
    ...defaultToasterProps,
    ...definedRest,
    toastOptions: mergedToastOptions.value,
  }
})
</script>

<template>
  <Sonner
    :class="
      cn(
        'toaster group font-sans text-popover-foreground [&_[data-sonner-toast]]:pointer-events-auto',
        props.class,
      )
    "
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      ...(props.style ?? {}),
    }"
    v-bind="passthrough"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>
