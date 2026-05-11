<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import PermissionFunctionTreeEditor from '@/components/common/PermissionFunctionTreeEditor.vue'
import {
  fetchPermissionDemoRoleById,
  fetchPermissionDemoRoleFunctions,
  savePermissionDemoRoleFunctions,
} from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'
import type { FunctionPermissionInfo } from '@/types/auth'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const roleTitle = ref('')
const items = ref<FunctionPermissionInfo[]>([])

const roleId = computed(() => String(route.params.id ?? ''))

onMounted(async () => {
  loading.value = true
  const id = roleId.value
  try {
    const role = await fetchPermissionDemoRoleById(id)
    if (!role) {
      toast.error('找不到此角色')
      void router.replace({ name: 'permission-demo-roles' })
      return
    }
    roleTitle.value = role.name
    const res = await fetchPermissionDemoRoleFunctions(id)
    items.value = res.functions
  } catch (e) {
    toast.error(isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '載入失敗')
    items.value = []
  } finally {
    loading.value = false
  }
})

async function onSave() {
  saving.value = true
  try {
    const result = await savePermissionDemoRoleFunctions(roleId.value, {
      functions: items.value.map((f) => ({ id: f.id, isEnabled: f.isEnabled })),
    })
    if (result.isFailure || !result.isSuccess) {
      toast.error(result.error.message || '儲存失敗')
      return
    }
    toast.success('已更新功能權限')
    void router.push({ name: 'permission-demo-roles' })
  } catch (e) {
    toast.error(isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '儲存失敗')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <p v-if="!loading" class="text-foreground mb-6 text-sm font-medium">角色：{{ roleTitle }}</p>

    <div v-if="loading" class="text-muted-foreground text-sm">載入中…</div>
    <div v-else class="space-y-4">
      <div class="border-border bg-card max-w-3xl space-y-4 rounded-lg border p-6">
        <p class="text-foreground text-sm font-medium">功能／選單項目</p>
        <PermissionFunctionTreeEditor v-model="items" />
        <div class="flex flex-wrap gap-2 pt-2">
          <Button type="button" :disabled="saving" @click="onSave">儲存變更</Button>
          <Button
            type="button"
            variant="outline"
            :disabled="saving"
            @click="router.push({ name: 'permission-demo-role-edit', params: { id: roleId } })"
          >
            返回編輯名稱
          </Button>
          <Button type="button" variant="ghost" :disabled="saving" @click="router.push({ name: 'permission-demo-roles' })">
            回角色清單
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
