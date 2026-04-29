<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { collectPermissionCodesFromRoleFunctions, login } from '@/api/auth'
import { toast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const permission = usePermissionStore()

const schema = toTypedSchema(
  z.object({
    account: z.string().min(1, '請輸入帳號'),
    pass: z.string().min(1, '請輸入密碼'),
  }),
)

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    pass: '',
  },
})

const [username, usernameAttrs] = defineField('account')
const [password, passwordAttrs] = defineField('pass')

const onSubmit = handleSubmit(async (values) => {
  try {
    const result = await login(values)
    auth.setSession(result.token, result.refreshToken)
    auth.setRoleFunctions(result.roleFunctions)
    permission.setPermissions(collectPermissionCodesFromRoleFunctions(result.roleFunctions))
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/app/dashboard'
    await router.replace(redirect)
  } catch (error) {
    if (error instanceof AxiosError) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : '登入失敗，請確認帳號或密碼'
      toast.error(message)
      return
    }
    toast.error(error instanceof Error ? error.message : '登入失敗，請稍後再試')
  }
})
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-background px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>登入</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-2">
            <Label for="login-username">帳號</Label>
            <Input
              id="login-username"
              v-model="username"
              v-bind="usernameAttrs"
              autocomplete="username"
              placeholder="請輸入帳號"
            />
            <p v-if="errors.account" class="text-destructive text-sm">{{ errors.account }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="login-password">密碼</Label>
            <Input
              id="login-password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              autocomplete="current-password"
              placeholder="請輸入密碼"
            />
            <p v-if="errors.pass" class="text-destructive text-sm">{{ errors.pass }}</p>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            {{ isSubmitting ? '登入中...' : '登入' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
