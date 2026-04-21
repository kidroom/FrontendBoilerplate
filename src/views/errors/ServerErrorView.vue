<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const route = useRoute()
const router = useRouter()

const hint = computed(() =>
  typeof route.query.message === 'string' ? route.query.message : '',
)
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-background px-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle class="text-4xl font-bold">500</CardTitle>
        <CardDescription>伺服器發生錯誤，請稍後再試。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-2">
        <p v-if="hint" class="text-muted-foreground text-sm">{{ hint }}</p>
        <p v-else class="text-muted-foreground text-sm">
          若問題持續，請保留時間點並聯絡技術支援。
        </p>
      </CardContent>
      <CardFooter class="flex justify-center gap-2">
        <Button variant="outline" @click="router.back()">返回上一頁</Button>
        <Button @click="router.push({ name: 'landing' })">回到首頁</Button>
      </CardFooter>
    </Card>
  </div>
</template>
