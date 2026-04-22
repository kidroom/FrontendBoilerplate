<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogOutIcon, MenuIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const app = useAppStore()
const auth = useAuthStore()
const router = useRouter()

async function logout() {
  auth.clearSession()
  await router.push({ name: 'login' })
}
</script>

<template>
  <header
    class="border-border bg-card/95 supports-[backdrop-filter]:bg-card/90 sticky top-0 z-[25] flex h-16 shrink-0 items-center gap-3 border-b px-3 shadow-sm backdrop-blur md:px-5"
  >
    <Button
      type="button"
      class="layout-menu-button shrink-0"
      variant="ghost"
      size="icon"
      :aria-label="app.sidebarOpen ? '收合側欄選單' : '展開側欄選單'"
      @click="app.toggleSidebar"
    >
      <MenuIcon class="size-5" />
    </Button>

    <div class="text-foreground min-w-0 flex-1 truncate text-base font-semibold tracking-tight">
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <ThemeSwitcher />
      <Button
        type="button"
        variant="outline"
        size="icon"
        class="border-sidebar-border/40 bg-background/80 shrink-0 shadow-xs"
        aria-label="登出"
        @click="logout"
      >
        <LogOutIcon class="size-4" />
      </Button>
    </div>
  </header>
</template>
