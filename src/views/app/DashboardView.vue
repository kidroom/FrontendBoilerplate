<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const router = useRouter()

const tiles = [
  {
    title: '範例列表',
    description: '查詢、分頁、排序、刪除確認',
    to: { name: 'demo-list' },
  },
  {
    title: '範例新增',
    description: 'VeeValidate + Zod 表單',
    to: { name: 'demo-create' },
  },
  {
    title: '範例上傳',
    description: '檔案選取與送出占位',
    to: { name: 'demo-upload' },
  },
  {
    title: '權限示範',
    description: 'v-auth、權限碼',
    to: { name: 'permission-demo' },
  },
] as const
</script>

<template>
  <div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="tile in tiles"
        :key="tile.title"
        class="cursor-pointer transition-shadow hover:shadow-md"
        role="button"
        tabindex="0"
        @click="router.push(tile.to)"
        @keydown.enter="router.push(tile.to)"
      >
        <CardHeader>
          <CardTitle class="text-base">{{ tile.title }}</CardTitle>
          <CardDescription>{{ tile.description }}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
