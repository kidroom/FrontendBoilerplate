<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createDemoItem } from '@/api/demo'
import { toast } from '@/composables/useToast'

const router = useRouter()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, '請輸入名稱'),
    status: z.enum(['active', 'draft']),
  }),
)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    status: 'draft' as 'active' | 'draft',
  },
})

const [name, nameAttrs] = defineField('name')
const [status] = defineField('status')

const onSubmit = handleSubmit(async (values) => {
  await createDemoItem(values)
  toast.success('已建立')
  void router.push({ name: 'demo-list' })
})
</script>

<template>
  <div>
    <form class="border-border bg-card max-w-lg space-y-4 rounded-lg border p-6" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <Label for="demo-name">名稱</Label>
        <Input id="demo-name" v-model="name" v-bind="nameAttrs" autocomplete="off" />
        <p v-if="errors.name" class="text-destructive text-sm">{{ errors.name }}</p>
      </div>
      <div class="grid gap-2">
        <Label for="demo-status">狀態</Label>
        <select
          id="demo-status"
          v-model="status"
          class="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <option value="draft">草稿</option>
          <option value="active">啟用</option>
        </select>
        <p v-if="errors.status" class="text-destructive text-sm">{{ errors.status }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button type="submit">送出</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'demo-list' })">取消</Button>
      </div>
    </form>
  </div>
</template>
