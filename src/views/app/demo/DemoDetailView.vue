<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { fetchDemoById } from '@/api/demo'
import type { DemoItem } from '@/types/demo'
const route = useRoute()
const router = useRouter()

const row = ref<DemoItem | null>(null)

async function load() {
  const id = route.params.id as string
  row.value = await fetchDemoById(id)
}

onMounted(() => {
  void load()
})

watch(
  () => route.params.id,
  () => {
    void load()
  },
)
</script>

<template>
  <div>
    <div v-if="row" class="border-border bg-card max-w-lg space-y-4 rounded-lg border p-6">
      <dl class="grid gap-2 text-sm">
        <div>
          <dt class="text-muted-foreground">ID</dt>
          <dd class="font-mono">{{ row.id }}</dd>
        </div>
        <div>
          <dt class="text-muted-foreground">名稱</dt>
          <dd>{{ row.name }}</dd>
        </div>
        <div>
          <dt class="text-muted-foreground">狀態</dt>
          <dd>{{ row.status }}</dd>
        </div>
        <div>
          <dt class="text-muted-foreground">更新時間</dt>
          <dd>{{ new Date(row.updatedAt).toLocaleString() }}</dd>
        </div>
      </dl>
      <div class="flex flex-wrap gap-2">
        <Button @click="router.push({ name: 'demo-edit', params: { id: row.id } })">編輯</Button>
        <Button variant="outline" @click="router.push({ name: 'demo-list' })">回列表</Button>
      </div>
    </div>
    <p v-else class="text-muted-foreground text-sm">找不到此筆資料。</p>
  </div>
</template>
