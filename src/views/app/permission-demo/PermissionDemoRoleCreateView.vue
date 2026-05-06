<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPermissionDemoRole } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'

const router = useRouter()

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, '請輸入角色名稱'),
  }),
)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
  },
})

const [name, nameAttrs] = defineField('name')

const onSubmit = handleSubmit(async (values) => {
  try {
    await createPermissionDemoRole({ name: values.name })
    toast.success('角色已建立')
    void router.push({ name: 'permission-demo-roles' })
  } catch (e) {
    const msg =
      isAxiosError(e) &&
      typeof e.response?.data === 'object' &&
      e.response.data !== null &&
      'message' in e.response.data &&
      typeof (e.response.data as { message: unknown }).message === 'string'
        ? (e.response.data as { message: string }).message
        : isAxiosError(e)
          ? e.message
          : e instanceof Error
            ? e.message
            : '建立角色失敗'
    toast.error(msg)
  }
})
</script>

<template>
  <div>
    <p class="text-muted-foreground mb-6 text-sm">
      對應 API：<code class="font-mono text-xs">POST /roles/createRole</code>（目前契約僅送出角色名稱）。
    </p>
    <form class="border-border bg-card max-w-lg space-y-6 rounded-lg border p-6" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <Label for="role-name">角色名稱 <span class="text-destructive">*</span></Label>
        <Input id="role-name" v-model="name" v-bind="nameAttrs" autocomplete="off" placeholder="例如：客服主管" />
        <p v-if="errors.name" class="text-destructive text-sm">{{ errors.name }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button type="submit">建立角色</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'permission-demo-roles' })">
          取消
        </Button>
      </div>
    </form>
  </div>
</template>
