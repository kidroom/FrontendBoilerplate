import type { Directive } from 'vue'
import { usePermissionStore } from '@/stores/permission'

function apply(el: HTMLElement, code: string) {
  const store = usePermissionStore()
  el.style.display = store.has(code) ? '' : 'none'
}

export const vAuth: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    apply(el, binding.value)
  },
  updated(el, binding) {
    apply(el, binding.value)
  },
}
