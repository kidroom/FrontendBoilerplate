import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ColorMode, ThemePresetId } from '@/types/theme'

const STORAGE_PRESET = 'app-theme-preset'
const STORAGE_MODE = 'app-color-mode'

function readStoredPreset(): ThemePresetId {
  try {
    const raw = localStorage.getItem(STORAGE_PRESET)
    if (raw === 'minimal' || raw === 'crm-taiwan') {
      return raw
    }
  } catch {
    /* ignore */
  }
  return 'crm-taiwan'
}

function readStoredMode(): ColorMode {
  try {
    const raw = localStorage.getItem(STORAGE_MODE)
    if (raw === 'light' || raw === 'dark') {
      return raw
    }
  } catch {
    /* ignore */
  }
  return 'light'
}

function applyToDocument(preset: ThemePresetId, mode: ColorMode) {
  document.documentElement.dataset.theme = preset
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export const useThemeStore = defineStore('theme', () => {
  const preset = ref<ThemePresetId>(readStoredPreset())
  const colorMode = ref<ColorMode>(readStoredMode())

  function setPreset(next: ThemePresetId) {
    preset.value = next
  }

  function setColorMode(next: ColorMode) {
    colorMode.value = next
  }

  function toggleColorMode() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  /** 於 Pinia 掛載後呼叫一次，並訂閱後續變更寫入 DOM／localStorage */
  function hydrate() {
    applyToDocument(preset.value, colorMode.value)
    watch(
      [preset, colorMode],
      ([p, m]) => {
        applyToDocument(p, m)
        try {
          localStorage.setItem(STORAGE_PRESET, p)
          localStorage.setItem(STORAGE_MODE, m)
        } catch {
          /* ignore */
        }
      },
      { flush: 'post' },
    )
  }

  return {
    preset,
    colorMode,
    setPreset,
    setColorMode,
    toggleColorMode,
    hydrate,
  }
})
