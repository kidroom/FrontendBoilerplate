<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { XIcon } from 'lucide-vue-next'
import type { RoleFunction } from '@/types/auth'
import { NAV_ICON_MAP } from '@/constants/navIcons'
import { buildNavSectionsFromRouter, type NavItem, type NavSection } from '@/utils/sidebarFromRoutes'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const app = useAppStore()
const auth = useAuthStore()
const router = useRouter()

const navSections = computed(() => buildNavSectionsFromRouter(router))

const isMobileLayout = useMediaQuery('(max-width: 767px)')

/** 桌機收合時為圖示窄欄（Sakai static-inactive 風格） */
const isRail = computed(() => !isMobileLayout.value && !app.sidebarOpen)

function collectRolePermissionNames(nodes: readonly RoleFunction[]): Set<string> {
  const names = new Set<string>()
  function walk(list: readonly RoleFunction[]) {
    for (const node of list) {
      if (node.name.length > 0) names.add(node.name)
      if (node.children.length > 0) walk(node.children)
    }
  }
  walk(nodes)
  return names
}

const rolePermissionNames = computed(() => collectRolePermissionNames(auth.roleFunctions))

const visibleSections = computed((): NavSection[] => {
  const out: NavSection[] = []
  for (const section of navSections.value) {
    // LoginResult.roleFunctions 的 name 對應 route.meta.permission，用於側欄顯示控制
    const items = section.items.filter(
      (item) => !item.permission || rolePermissionNames.value.has(item.permission),
    )
    if (items.length > 0) {
      out.push({ title: section.title, items })
    }
  }
  return out
})

const showSectionTitles = computed(() => isMobileLayout.value || app.sidebarOpen)

function onNavigate(navigate: () => void) {
  navigate()
  if (isMobileLayout.value) {
    app.closeSidebar()
  }
}

function iconFor(item: NavItem) {
  const name = item.icon
  return name ? NAV_ICON_MAP[name] : null
}
</script>

<template>
  <aside
    data-app-sidebar
    :data-rail="isRail ? '' : undefined"
    :class="[
      'border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col border-r shadow-sm transition-[width,min-width,transform,opacity] duration-200 ease-out',
      'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-[45] max-md:h-svh max-md:w-64 max-md:shadow-lg',
      app.sidebarOpen ? 'max-md:translate-x-0' : 'max-md:pointer-events-none max-md:-translate-x-full',
      app.sidebarOpen
        ? 'md:w-64 md:min-w-64 md:max-w-64 md:shrink-0'
        : 'md:w-[4.5rem] md:min-w-[4.5rem] md:max-w-[4.5rem] md:shrink-0',
    ]"
  >
    <!-- 品牌列（參考 Sakai 側欄頂部 logo 區） -->
    <div
      class="border-sidebar-border flex h-16 shrink-0 items-center gap-3 border-b px-4"
      :class="isRail ? 'md:justify-center md:px-2' : ''"
    >
      <div
        class="from-primary to-primary/80 text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold shadow-sm"
        aria-hidden="true"
      >
        S
      </div>
      <div v-if="!isRail" class="min-w-0 flex-1 max-md:block">
        <p class="truncate text-sm font-semibold tracking-tight">CRM</p>
        <p class="text-sidebar-foreground/70 truncate text-xs">後台版型</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shrink-0 md:hidden"
        aria-label="關閉選單"
        @click="app.closeSidebar"
      >
        <XIcon class="size-5" />
      </Button>
    </div>

    <nav class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-3" aria-label="主選單">
      <div v-for="section in visibleSections" :key="section.title" class="space-y-1">
        <p
          v-show="showSectionTitles"
          class="text-sidebar-foreground/55 px-3 pb-1 text-xs font-semibold tracking-wide uppercase"
        >
          {{ section.title }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in section.items" :key="`${section.title}:${String(item.to.name)}`">
            <RouterLink :to="item.to" custom v-slot="{ href, navigate, isActive }">
              <a
                :href="href"
                :title="isRail ? item.label : undefined"
                class="border-sidebar-primary/80 flex items-center gap-3 rounded-md border-l-[3px] border-transparent py-2.5 text-sm transition-colors"
                :class="[
                  isRail ? 'md:justify-center md:border-l-0 md:px-0 md:py-3' : 'px-3',
                  isActive
                    ? [
                        'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary font-medium shadow-sm',
                        isRail ? 'md:border-l-0' : '',
                      ]
                    : 'text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                ]"
                @click.prevent="onNavigate(navigate)"
              >
                <component
                  :is="iconFor(item)"
                  v-if="iconFor(item)"
                  class="size-[1.15rem] shrink-0 opacity-90"
                  aria-hidden="true"
                />
                <span v-if="!isRail" class="min-w-0 truncate max-md:inline md:inline">{{ item.label }}</span>
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div
      class="border-sidebar-border mt-auto shrink-0 border-t p-3 text-xs text-sidebar-foreground/75"
      :class="isRail ? 'md:flex md:justify-center md:px-1' : ''"
    >
      <p v-if="!isRail" class="truncate">登入：{{ auth.isAuthenticated ? '已登入' : '未登入' }}</p>
      <p
        v-else
        class="hidden font-medium md:block"
        :title="auth.isAuthenticated ? '已登入' : '未登入'"
        aria-hidden="true"
      >
        {{ auth.isAuthenticated ? '●' : '○' }}
      </p>
    </div>
  </aside>
</template>
