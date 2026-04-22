import { ref } from 'vue'
import { defineStore } from 'pinia'

function isDesktopViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
}

export const useAppStore = defineStore('app', () => {
  /**
   * 手機：抽屜是否開啟。
   * 桌機：`true` 為完整寬側欄，`false` 為圖示窄欄（Sakai static-inactive 風格）。
   */
  const sidebarOpen = ref(true)
  /** 僅記錄桌機寬度下的側欄展開／窄欄偏好；進出手機版面時與 `sidebarOpen` 同步還原 */
  const desktopSidebarOpen = ref(true)
  const pageLoading = ref(false)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
    if (isDesktopViewport()) {
      desktopSidebarOpen.value = sidebarOpen.value
    }
  }

  /** 手機遮罩、抽屜內關閉：只關閉目前抽屜，不修改 desktopSidebarOpen */
  function closeSidebar() {
    sidebarOpen.value = false
  }

  function setSidebarOpen(value: boolean) {
    sidebarOpen.value = value
    if (isDesktopViewport()) {
      desktopSidebarOpen.value = value
    }
  }

  /** 由窄變寬（離開手機版面）時呼叫：還原桌機記憶 */
  function restoreSidebarForDesktopLayout() {
    sidebarOpen.value = desktopSidebarOpen.value
  }

  /** 由寬變窄（進入手機版面）時呼叫：記住桌機狀態後關閉抽屜 */
  function collapseSidebarForMobileLayout() {
    desktopSidebarOpen.value = sidebarOpen.value
    sidebarOpen.value = false
  }

  function setPageLoading(value: boolean) {
    pageLoading.value = value
  }

  return {
    sidebarOpen,
    desktopSidebarOpen,
    pageLoading,
    toggleSidebar,
    closeSidebar,
    setSidebarOpen,
    restoreSidebarForDesktopLayout,
    collapseSidebarForMobileLayout,
    setPageLoading,
  }
})
