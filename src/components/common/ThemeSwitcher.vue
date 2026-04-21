<script setup lang="ts">
import { computed } from 'vue'
import { MoonIcon, PaletteIcon, SunIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/composables/useTheme'
import { THEME_PRESET_IDS, THEME_PRESET_LABELS } from '@/types/theme'

const { preset, colorMode, setPreset, toggleColorMode } = useTheme()

const presetModel = computed({
  get: () => preset.value,
  set: (value: string) => {
    if (value === 'minimal' || value === 'crm-taiwan') {
      setPreset(value)
    }
  },
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="flex items-center gap-2">
      <PaletteIcon
        class="text-muted-foreground size-4 shrink-0 max-md:hidden"
        aria-hidden="true"
      />
      <Label for="theme-preset" class="sr-only">主題風格</Label>
      <select
        id="theme-preset"
        v-model="presetModel"
        class="border-input bg-background text-foreground focus-visible:ring-ring/50 h-9 max-w-[12rem] rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
      >
        <option v-for="id in THEME_PRESET_IDS" :key="id" :value="id">
          {{ THEME_PRESET_LABELS[id] }}
        </option>
      </select>
    </div>
    <Button
      type="button"
      variant="outline"
      size="icon"
      :aria-label="colorMode === 'dark' ? '切換為淺色' : '切換為深色'"
      @click="toggleColorMode"
    >
      <SunIcon v-if="colorMode === 'dark'" class="size-4" />
      <MoonIcon v-else class="size-4" />
    </Button>
  </div>
</template>
