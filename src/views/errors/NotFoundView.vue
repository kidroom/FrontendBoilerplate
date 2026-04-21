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
        <CardTitle class="text-4xl font-bold">404</CardTitle>
        <CardDescription>找不到此頁面，可能網址已變更或無權限存取。</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">請檢查網址，或從首頁重新導覽。</p>
      </CardContent>
      <CardFooter class="flex justify-center gap-2">
        <Button variant="outline" @click="router.back()">返回上一頁</Button>
        <Button @click="router.push({ name: 'landing' })">回到首頁</Button>
      </CardFooter>
    </Card>
  </div>
</template>
