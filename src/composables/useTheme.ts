import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const store = useThemeStore()
  const { preset, colorMode } = storeToRefs(store)
  return {
    preset,
    colorMode,
    setPreset: store.setPreset,
    setColorMode: store.setColorMode,
    toggleColorMode: store.toggleColorMode,
  }
}
