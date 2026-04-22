<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const route = useRoute()
const app = useAppStore()

const isMobileLayout = useMediaQuery('(max-width: 767px)')

const title = computed(() => (route.meta.title as string | undefined) ?? '')
const description = computed(() => (route.meta.description as string | undefined) ?? '')
const breadcrumb = computed(() => route.meta.breadcrumb ?? [])

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

    <AppSidebar />

    <div class="flex min-h-0 min-w-0 flex-1 flex-col">
      <AppTopbar />

      <main class="bg-muted/25 min-h-0 flex-1 overflow-auto p-4 md:p-6">
        <div class="mx-auto max-w-[1600px]">
          <PageHeader
            :title="title"
            :description="description"
            :breadcrumbs="breadcrumb"
          />
          <RouterView />
        </div>
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
