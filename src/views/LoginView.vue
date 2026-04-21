<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TEMPLATE_DEFAULT_PERMISSIONS } from '@/constants/permissions'
import { useAuthStore } from '@/stores/auth'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const permission = usePermissionStore()

function mockLogin() {
  auth.setToken('dev-mock-token')
  permission.setPermissions([...TEMPLATE_DEFAULT_PERMISSIONS])
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/app/dashboard'
  void router.replace(redirect)
}
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-background px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>登入（範例）</CardTitle>
        <CardDescription>
          模擬登入會寫入 token、注入模板權限碼，並導向儀表板。請日後改為實際登入 API 與契約。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button class="w-full" @click="mockLogin">模擬登入（開發用）</Button>
      </CardContent>
    </Card>
  </div>
</template>
