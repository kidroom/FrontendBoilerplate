<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { usePermission } from '@/composables/usePermission'
import { toast } from '@/composables/useToast'

const { hasPermission, permissions } = usePermission()

function tryAction(code: string) {
  toast.message(`需要權限：${code}`, { description: hasPermission(code) ? '您擁有此權限' : '您沒有此權限' })
}
</script>

<template>
  <div>
    <div class="border-border bg-card mb-6 rounded-lg border p-4">
      <p class="text-muted-foreground mb-2 text-sm font-medium">目前權限集合（登入時注入）</p>
      <ul class="text-muted-foreground list-inside list-disc text-sm">
        <li v-for="p in Array.from(permissions)" :key="p">{{ p }}</li>
      </ul>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button v-auth="'demo:delete'" variant="destructive" @click="tryAction('demo:delete')">
        需要 demo:delete
      </Button>
      <Button v-auth="'demo:write'" variant="secondary" @click="tryAction('demo:write')">
        需要 demo:write
      </Button>
      <Button v-auth="'not:exists'" variant="outline" @click="tryAction('not:exists')">
        不存在之權限（應隱藏）
      </Button>
    </div>
  </div>
</template>
