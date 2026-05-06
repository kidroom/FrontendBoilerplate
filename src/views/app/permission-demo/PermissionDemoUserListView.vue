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
import { SelectField } from '@/components/common'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deletePermissionDemoUser, fetchPermissionDemoRoles, fetchPermissionDemoUsers } from '@/api/permissionDemo'
import { toast } from '@/composables/useToast'
import type { FormOption } from '@/types/form-options'
import type { PermissionDemoRole, PermissionDemoUser } from '@/types/permissionDemo'

const router = useRouter()
const loading = ref(true)
const users = ref<PermissionDemoUser[]>([])
const roles = ref<PermissionDemoRole[]>([])

const keyword = ref('')
const filterRoleId = ref('')
const roleFilterOptions = ref<FormOption<string>[]>([])

const confirmOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

function formatDt(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString()
}

async function load() {
  loading.value = true
  try {
    const roleRows = await fetchPermissionDemoRoles()
    roles.value = roleRows
    roleFilterOptions.value = [{ label: '全部角色', value: '' }, ...roleRows.map((r) => ({ label: r.name, value: r.id }))]
    users.value = await fetchPermissionDemoUsers({
      keyword: keyword.value.trim() || null,
      roleId: filterRoleId.value || null,
    })
  } catch (e) {
    toast.error(
      isAxiosError(e) ? (e.response?.data as { message?: string })?.message ?? e.message : '載入使用者失敗',
    )
    users.value = []
  } finally {
    loading.value = false
  }
}

function onSearch() {
  void load()
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
    const result = await deletePermissionDemoUser(id)
    if (result.isFailure || !result.isSuccess) {
      toast.error(result.error.message || '刪除失敗')
      return
    }
    toast.success('已刪除使用者')
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
        取得：<code class="font-mono text-xs">GET /users/getUsers</code>；刪除：<code class="font-mono text-xs">POST /users/deleteUser/:id</code>
      </p>
      <Button type="button" @click="router.push({ name: 'permission-demo-user-create' })">建立使用者</Button>
    </div>

    <div class="border-border bg-card mb-4 flex flex-wrap items-end gap-4 rounded-lg border p-4">
      <div class="grid min-w-[12rem] flex-1 gap-2">
        <Label for="user-keyword">關鍵字</Label>
        <Input
          id="user-keyword"
          v-model="keyword"
          placeholder="帳號或名稱（可留空）"
          autocomplete="off"
          @keydown.enter.prevent="onSearch"
        />
      </div>
      <div class="grid min-w-[12rem] gap-2">
        <Label for="user-role-filter">角色</Label>
        <SelectField id="user-role-filter" v-model="filterRoleId" :options="roleFilterOptions" />
      </div>
      <Button type="button" class="shrink-0" @click="onSearch">查詢</Button>
    </div>

    <div class="border-border bg-card overflow-x-auto rounded-lg border">
      <table class="divide-border text-foreground w-full min-w-[760px] table-fixed divide-y text-sm">
        <thead>
          <tr class="[&_th]:align-middle">
            <th class="text-foreground px-4 py-3 text-left font-medium">帳號</th>
            <th class="text-foreground px-4 py-3 text-left font-medium">顯示名稱</th>
            <th class="text-foreground px-4 py-3 text-left font-medium">角色</th>
            <th class="text-foreground px-4 py-3 text-left font-medium">已核准</th>
            <th class="text-foreground px-4 py-3 text-left font-medium">建立時間</th>
            <th class="text-foreground px-4 py-3 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="divide-border divide-y">
          <tr v-if="loading">
            <td colspan="6" class="text-muted-foreground px-4 py-8 text-center">載入中…</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="text-muted-foreground px-4 py-8 text-center">尚無使用者</td>
          </tr>
          <tr v-for="row in users" :key="row.id" class="hover:bg-muted/40">
            <td class="px-4 py-3 align-middle font-mono">{{ row.account }}</td>
            <td class="px-4 py-3 align-middle">{{ row.displayName }}</td>
            <td class="px-4 py-3 align-middle">{{ row.roleName || '—' }}</td>
            <td class="text-muted-foreground px-4 py-3 align-middle">{{ row.isApproved ? '是' : '否' }}</td>
            <td class="text-muted-foreground px-4 py-3 align-middle whitespace-nowrap">
              {{ formatDt(row.createDate) }}
            </td>
            <td class="px-4 py-3 text-right align-middle">
              <div class="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="router.push({ name: 'permission-demo-user-edit', params: { id: row.id } })"
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
          <AlertDialogTitle>確定刪除此使用者？</AlertDialogTitle>
          <AlertDialogDescription>此動作無法還原。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">刪除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
