<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/common'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchPermissionDemoRoles, fetchPermissionDemoUserById, updatePermissionDemoUser } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'
import type { FormOption } from '@/types/form-options'

const route = useRoute()
const router = useRouter()
const pageLoading = ref(true)
const rolesLoading = ref(true)
const accountDisplay = ref('')
const roleOptions = ref<FormOption<string>[]>([])

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().min(1, '請輸入顯示名稱'),
    roleId: z.string().min(1, '請選擇角色'),
    remark: z.string(),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { name: '', roleId: '', remark: '' },
})

const [name, nameAttrs] = defineField('name')
const [roleId] = defineField('roleId')
const [remark, remarkAttrs] = defineField('remark')

onMounted(async () => {
  pageLoading.value = true
  rolesLoading.value = true
  const id = String(route.params.id ?? '')
  try {
    const [user, roleRows] = await Promise.all([fetchPermissionDemoUserById(id), fetchPermissionDemoRoles()])
    roleOptions.value = roleRows.map((r) => ({ label: r.name, value: r.id }))
    if (!user) {
      toast.error('找不到此使用者')
      void router.replace({ name: 'permission-demo-users' })
      return
    }
    accountDisplay.value = user.account
    resetForm({
      values: {
        name: user.displayName,
        roleId: user.roleId,
        remark: user.remark ?? '',
      },
    })
  } finally {
    pageLoading.value = false
    rolesLoading.value = false
  }
})

const onSubmit = handleSubmit(async (values) => {
  const id = String(route.params.id ?? '')
  try {
    await updatePermissionDemoUser(id, {
      name: values.name.trim(),
      roleId: values.roleId,
      remark: values.remark.trim(),
    })
    toast.success('使用者已更新')
    void router.push({ name: 'permission-demo-users' })
  } catch (e) {
    toast.error(
      isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '更新失敗',
    )
  }
})
</script>

<template>
  <div>
    <p class="text-muted-foreground mb-6 text-sm">
      對應 API：<code class="font-mono text-xs">PATCH /users/:id</code>；帳號不可變更。
    </p>
    <div v-if="pageLoading" class="text-muted-foreground text-sm">載入中…</div>
    <form
      v-else
      class="border-border bg-card max-w-lg space-y-4 rounded-lg border p-6"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-2">
        <Label>帳號</Label>
        <p class="text-foreground font-mono text-sm">{{ accountDisplay }}</p>
      </div>
      <div class="grid gap-2">
        <Label for="user-name-edit">顯示名稱 <span class="text-destructive">*</span></Label>
        <Input id="user-name-edit" v-model="name" v-bind="nameAttrs" autocomplete="name" />
        <p v-if="errors.name" class="text-destructive text-sm">{{ errors.name }}</p>
      </div>
      <div class="grid gap-2">
        <Label for="user-role-edit">角色 <span class="text-destructive">*</span></Label>
        <SelectField
          id="user-role-edit"
          v-model="roleId"
          :options="roleOptions"
          :disabled="rolesLoading || roleOptions.length === 0"
          placeholder="請選擇角色"
        />
        <p v-if="errors.roleId" class="text-destructive text-sm">{{ errors.roleId }}</p>
      </div>
      <div class="grid gap-2">
        <Label for="user-remark-edit">備註</Label>
        <Input id="user-remark-edit" v-model="remark" v-bind="remarkAttrs" autocomplete="off" />
      </div>
      <div class="flex flex-wrap gap-2">
        <Button type="submit" :disabled="rolesLoading || roleOptions.length === 0">儲存</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'permission-demo-users' })">
          取消
        </Button>
      </div>
    </form>
  </div>
</template>
