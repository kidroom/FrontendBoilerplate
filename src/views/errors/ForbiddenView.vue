<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-background px-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle class="text-4xl font-bold">403</CardTitle>
        <CardDescription>您沒有權限瀏覽此頁面或執行此操作。</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">
          若應有權限，請聯絡管理員於後端調整角色，並重新登入取得最新權限。
        </p>
      </CardContent>
      <CardFooter class="flex justify-center gap-2">
        <Button variant="outline" @click="router.back()">返回上一頁</Button>
        <Button @click="router.push({ name: 'dashboard' })">回到儀表板</Button>
      </CardFooter>
    </Card>
  </div>
</template>
