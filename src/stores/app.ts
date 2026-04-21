import { ref } from 'vue'
import { defineStore } from 'pinia'

function isDesktopViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
}

export const useAppStore = defineStore('app', () => {
  /** 目前側欄 UI：手機抽屜／桌機寬度展開 */
  const sidebarOpen = ref(true)
  /**
   * 僅記錄「桌機寬度」下的開合偏好。
   * 縮小到手機時會先把當前桌機狀態存進此值，再關閉抽屜；放大回桌機時由此還原。
   */
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
