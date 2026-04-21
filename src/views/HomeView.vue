<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isAuthed = computed(() => auth.isAuthenticated)
</script>

<template>
  <div class="min-h-svh bg-background px-4 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vue 3 CRM 前端模板</CardTitle>
          <CardDescription>
            依專案規範提供 Layout、登入、錯誤頁、Toast、權限、範例 CRUD／上傳等骨架；細節請對接後端 API。
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button v-if="!isAuthed" as-child>
            <RouterLink to="/login">前往登入</RouterLink>
          </Button>
          <Button v-else as-child>
            <RouterLink to="/app/dashboard">進入後台（儀表板）</RouterLink>
          </Button>
          <Button variant="outline" as-child>
            <a href="https://vite.dev" target="_blank" rel="noreferrer">Vite 文件</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
