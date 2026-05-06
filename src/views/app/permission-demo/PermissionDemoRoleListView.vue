<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deletePermissionDemoRole, fetchPermissionDemoRoles } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'
import type { PermissionDemoRole } from '@/types/permissionDemo'

const router = useRouter()
const loading = ref(true)
const roles = ref<PermissionDemoRole[]>([])

const confirmOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

async function load() {
  loading.value = true
  try {
    roles.value = await fetchPermissionDemoRoles()
  } catch (e) {
    toast.error(isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '載入角色失敗')
    roles.value = []
  } finally {
    loading.value = false
  }
}

function openDelete(id: string) {
  pendingDeleteId.value = id
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return
  const id = pendingDeleteId.value
  pendingDeleteId.value = null
  confirmOpen.value = false
  try {
    const result = await deletePermissionDemoRole(id)
    if (result.isFailure || !result.isSuccess) {
      toast.error(result.error.message || '刪除失敗')
      return
    }
    toast.success('已刪除角色')
    void load()
  } catch (e) {
    toast.error(isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '刪除失敗')
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p class="text-muted-foreground text-sm">
        取得：<code class="font-mono text-xs">GET /roles/getRoles</code>；刪除：<code class="font-mono text-xs">POST /users/deleteRole/:id</code>
      </p>
      <Button type="button" @click="router.push({ name: 'permission-demo-role-create' })">建立角色</Button>
    </div>

    <div class="border-border bg-card overflow-x-auto rounded-lg border">
      <table class="divide-border text-foreground w-full min-w-[560px] table-fixed divide-y text-sm">
        <thead>
          <tr class="[&_th]:align-middle">
            <th class="text-foreground px-4 py-3 text-left font-medium">角色名稱</th>
            <th class="text-foreground px-4 py-3 text-left font-medium">啟用</th>
            <th class="text-foreground px-4 py-3 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-border divide-y">
          <tr v-if="loading">
            <td colspan="3" class="text-muted-foreground px-4 py-8 text-center">載入中…</td>
          </tr>
          <tr v-else-if="roles.length === 0">
            <td colspan="3" class="text-muted-foreground px-4 py-8 text-center">尚無角色</td>
          </tr>
          <tr v-for="row in roles" :key="row.id" class="hover:bg-muted/40">
            <td class="px-4 py-3 align-middle">{{ row.name }}</td>
            <td class="text-muted-foreground px-4 py-3 align-middle">{{ row.isEnabled ? '是' : '否' }}</td>
            <td class="px-4 py-3 text-right align-middle">
              <div class="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="router.push({ name: 'permission-demo-role-edit', params: { id: row.id } })"
                >
                  編輯
                </Button>
                <Button type="button" variant="destructive" size="sm" @click="openDelete(row.id)">刪除</Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AlertDialog v-model:open="confirmOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定刪除此角色？</AlertDialogTitle>
          <AlertDialogDescription>此動作可能影響既有使用者角色關聯，且無法還原。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">刪除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
