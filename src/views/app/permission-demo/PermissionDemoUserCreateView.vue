<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/common'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPermissionDemoUser, fetchPermissionDemoRoles } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'
import type { FormOption } from '@/types/form-options'
import type { PermissionDemoRole } from '@/types/permissionDemo'

const router = useRouter()
const roleRows = ref<PermissionDemoRole[]>([])
const rolesLoading = ref(true)

const schema = toTypedSchema(
  z.object({
    account: z.string().trim().min(1, '請輸入帳號'),
    pass: z.string().min(1, '請輸入密碼'),
    displayName: z.string().trim().min(1, '請輸入顯示名稱'),
    roleId: z.string().min(1, '請選擇角色'),
    remark: z.string(),
  }),
)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    pass: '',
    displayName: '',
    roleId: '',
    remark: '',
  },
})

const [account, accountAttrs] = defineField('account')
const [pass, passAttrs] = defineField('pass')
const [displayName, displayNameAttrs] = defineField('displayName')
const [roleId] = defineField('roleId')
const [remark, remarkAttrs] = defineField('remark')

const roleOptions = ref<FormOption<string>[]>([])

onMounted(async () => {
  rolesLoading.value = true
  try {
    roleRows.value = await fetchPermissionDemoRoles()
    roleOptions.value = roleRows.value.map((r) => ({ label: r.name, value: r.id }))
  } catch (e) {
    toast.error(
      isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '載入角色失敗',
    )
    roleOptions.value = []
  } finally {
    rolesLoading.value = false
  }
})

function extractErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const data = e.response?.data
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
    return e.message
  }
  return e instanceof Error ? e.message : '建立使用者失敗'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await createPermissionDemoUser({
      account: values.account,
      pass: values.pass,
      displayName: values.displayName,
      roleId: values.roleId,
      remark: values.remark,
    })
    toast.success('使用者已建立')
    void router.push({ name: 'permission-demo-users' })
  } catch (e) {
    toast.error(extractErrorMessage(e))
  }
})
</script>

<template>
  <div>
    <p class="text-muted-foreground mb-6 text-sm">
      對應 API：<code class="font-mono text-xs">POST /users/createUser</code>（顯示名稱對應欄位 <code class="font-mono text-xs">name</code>）。
    </p>
    <form class="border-border bg-card max-w-lg space-y-4 rounded-lg border p-6" @submit.prevent="onSubmit">
      <div class="grid gap-2">
        <Label for="user-account">帳號 <span class="text-destructive">*</span></Label>
        <Input
          id="user-account"
          v-model="account"
          v-bind="accountAttrs"
          autocomplete="username"
          placeholder="登入帳號"
        />
        <p v-if="errors.account" class="text-destructive text-sm">{{ errors.account }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="user-pass">密碼 <span class="text-destructive">*</span></Label>
        <Input
          id="user-pass"
          v-model="pass"
          v-bind="passAttrs"
          type="password"
          autocomplete="new-password"
        />
        <p v-if="errors.pass" class="text-destructive text-sm">{{ errors.pass }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="user-display">顯示名稱 <span class="text-destructive">*</span></Label>
        <Input
          id="user-display"
          v-model="displayName"
          v-bind="displayNameAttrs"
          autocomplete="name"
          placeholder="畫面上顯示的姓名"
        />
        <p v-if="errors.displayName" class="text-destructive text-sm">{{ errors.displayName }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="user-role">角色 <span class="text-destructive">*</span></Label>
        <SelectField
          id="user-role"
          v-model="roleId"
          :options="roleOptions"
          :disabled="rolesLoading || roleOptions.length === 0"
          placeholder="請選擇角色"
        />
        <p v-if="rolesLoading" class="text-muted-foreground text-sm">載入角色中…</p>
        <p v-else-if="roleOptions.length === 0" class="text-muted-foreground text-sm">請先到「角色清單」建立角色。</p>
        <p v-if="errors.roleId" class="text-destructive text-sm">{{ errors.roleId }}</p>
      </div>

      <div class="grid gap-2">
        <Label for="user-remark">備註</Label>
        <Input id="user-remark" v-model="remark" v-bind="remarkAttrs" autocomplete="off" placeholder="選填；後端必填時可留白字串送出" />
        <p v-if="errors.remark" class="text-destructive text-sm">{{ errors.remark }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button type="submit" :disabled="rolesLoading || roleOptions.length === 0">建立使用者</Button>
        <Button type="button" variant="outline" @click="router.push({ name: 'permission-demo-users' })">
          取消
        </Button>
      </div>
    </form>
  </div>
</template>
