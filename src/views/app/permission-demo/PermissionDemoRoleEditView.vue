<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchPermissionDemoRoleById, updatePermissionDemoRole } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const pageLoading = ref(true)

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, '請輸入角色名稱'),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { name: '' },
})

const [name, nameAttrs] = defineField('name')

onMounted(async () => {
  pageLoading.value = true
  const id = String(route.params.id ?? '')
  try {
    const row = await fetchPermissionDemoRoleById(id)
    if (!row) {
      toast.error('找不到此角色')
      void router.replace({ name: 'permission-demo-roles' })
      return
    }
    resetForm({ values: { name: row.name } })
  } finally {
    pageLoading.value = false
  }
})

const onSubmit = handleSubmit(async (values) => {
  const id = String(route.params.id ?? '')
  try {
    await updatePermissionDemoRole(id, { name: values.name.trim() })
    toast.success('角色已更新')
    void router.push({ name: 'permission-demo-roles' })
  } catch (e) {
    toast.error(
      isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '更新失敗',
    )
  }
})
</script>

<template>
  <div>
    <p class="text-muted-foreground mb-2 text-sm">
      對應 API：<code class="font-mono text-xs">PATCH /roles/:id</code>
    </p>
    <p class="text-muted-foreground mb-6 text-sm">
      <Button
        v-if="!pageLoading"
        type="button"
        variant="link"
        class="text-muted-foreground h-auto px-0 py-0 text-sm underline"
        @click="router.push({ name: 'permission-demo-role-functions', params: { id: String(route.params.id ?? '') } })"
      >
        設定此角色的功能／選單權限
      </Button>
    </p>
    <div v-if="pageLoading" class="text-muted-foreground text-sm">載入中…</div>
    <form
      v-else
      class="border-border bg-card max-w-lg space-y-6 rounded-lg border p-6"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-2">
        <Label for="role-name-edit">角色名稱 <span class="text-destructive">*</span></Label>
        <Input id="role-name-edit" v-model="name" v-bind="nameAttrs" autocomplete="off" />
        <p v-if="errors.name" class="text-destructive text-sm">{{ errors.name }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button type="submit">儲存</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'permission-demo-roles' })">
          取消
        </Button>
      </div>
    </form>
  </div>
</template>
