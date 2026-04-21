<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from '@/composables/useToast'

const fileName = ref<string | null>(null)

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  fileName.value = file ? file.name : null
}

function submit() {
  toast.success('已接收檔案（模板未實際上傳，請替換為後端 API）', {
    description: fileName.value ?? '未選擇檔案',
  })
}
</script>

<template>
  <div>
    <div class="border-border bg-card max-w-lg space-y-4 rounded-lg border p-6">
      <div class="grid gap-2">
        <Label for="file">選擇檔案</Label>
        <input
          id="file"
          type="file"
          class="text-muted-foreground text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
          @change="onFile"
        />
        <p v-if="fileName" class="text-muted-foreground text-sm">已選：{{ fileName }}</p>
      </div>
      <Button type="button" @click="submit">送出（示範）</Button>
    </div>
  </div>
</template>
