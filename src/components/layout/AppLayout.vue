<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { MenuIcon, XIcon } from 'lucide-vue-next'
import { APP_NAV_ITEMS } from '@/constants/navigation'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { usePermission } from '@/composables/usePermission'
import PageHeader from '@/components/common/PageHeader.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'

const route = useRoute()
const app = useAppStore()
const auth = useAuthStore()
const { hasPermission } = usePermission()

/** 與 Tailwind md 斷點一致，用於遮罩與導航後是否關閉抽屜 */
const isMobileLayout = useMediaQuery('(max-width: 767px)')

const title = computed(() => (route.meta.title as string | undefined) ?? '')
const description = computed(() => (route.meta.description as string | undefined) ?? '')
const breadcrumb = computed(() => route.meta.breadcrumb ?? [])

const visibleNav = computed(() =>
  APP_NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission)),
)

const showMobileOverlay = computed(() => app.sidebarOpen && isMobileLayout.value)

onMounted(() => {
  if (isMobileLayout.value) {
    app.setSidebarOpen(false)
  }
})

watch(
  isMobileLayout,
  (mobile, prevMobile) => {
    if (prevMobile === undefined) {
      return
    }
    if (mobile && !prevMobile) {
      app.collapseSidebarForMobileLayout()
    } else if (!mobile && prevMobile) {
      app.restoreSidebarForDesktopLayout()
    }
  },
)

function onNavigate(navigate: () => void) {
  navigate()
  if (isMobileLayout.value) {
    app.closeSidebar()
  }
}
</script>

<template>
  <div class="bg-background flex min-h-svh w-full">
    <button
      v-if="showMobileOverlay"
      type="button"
      class="fixed inset-0 z-[35] bg-black/40 md:hidden"
      aria-label="關閉選單"
      @click="app.closeSidebar"
    />

    <aside
      :class="[
        'border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col border-r transition-all duration-200 ease-out',
        'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-[45] max-md:h-svh max-md:w-64 max-md:shadow-lg',
        app.sidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
        app.sidebarOpen
          ? 'md:w-64 md:min-w-64 md:shrink-0 md:opacity-100'
          : 'md:w-0 md:min-w-0 md:max-w-0 md:shrink md:overflow-hidden md:border-transparent md:opacity-0 md:pointer-events-none',
      ]"
    >
      <div class="border-sidebar-border flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
        <span class="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight">CRM 模板</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0 md:hidden"
          aria-label="關閉側欄"
          @click="app.closeSidebar"
        >
          <XIcon class="size-5" />
        </Button>
      </div>
      <nav class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="主選單">
        <RouterLink
          v-for="item in visibleNav"
          :key="String(item.to)"
          :to="item.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            class="rounded-md px-3 py-2 text-sm transition-colors"
            :class="
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            "
            @click="onNavigate(navigate)"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>
      <div class="border-sidebar-border mt-auto shrink-0 border-t p-3 text-xs text-sidebar-foreground/75">
        <p class="truncate">登入狀態：{{ auth.isAuthenticated ? '已登入' : '未登入' }}</p>
      </div>
    </aside>

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <header
        class="border-border bg-card/95 supports-[backdrop-filter]:bg-card/85 sticky top-0 z-[25] flex h-14 shrink-0 items-center gap-2 border-b px-3 shadow-sm backdrop-blur md:px-4"
      >
        <Button
          type="button"
          class="shrink-0"
          variant="ghost"
          size="icon"
          :aria-label="app.sidebarOpen ? '收合側欄' : '展開側欄'"
          @click="app.toggleSidebar"
        >
          <MenuIcon class="size-5" />
        </Button>
        <div class="text-foreground min-w-0 flex-1 truncate text-sm font-semibold md:text-base">
        </div>
        <ThemeSwitcher class="shrink-0" />
      </header>

      <main class="bg-muted/20 min-h-0 flex-1 overflow-auto p-4 md:p-6">
        <PageHeader
          :title="title"
          :description="description"
          :breadcrumbs="breadcrumb"
        />
        <RouterView />
      </main>
    </div>

    <div
      v-if="app.pageLoading"
      class="fixed inset-0 z-[90] flex items-center justify-center bg-background/50"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="border-primary size-10 animate-spin rounded-full border-2 border-t-transparent" />
    </div>
  </div>
</template>
