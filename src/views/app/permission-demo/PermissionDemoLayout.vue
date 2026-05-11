<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const links = computed(() => {
  const n = route.name
  const rolesActive =
    n === 'permission-demo-roles' ||
    n === 'permission-demo-role-create' ||
    n === 'permission-demo-role-edit' ||
    n === 'permission-demo-role-functions'
  const usersActive =
    n === 'permission-demo-users' ||
    n === 'permission-demo-user-create' ||
    n === 'permission-demo-user-edit'
  const playgroundActive = n === 'permission-demo-playground'

  const base =
    'text-muted-foreground hover:text-foreground hover:border-border rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors'
  const active = 'border-border bg-background text-foreground shadow-sm'

  return [
    { label: '角色清單', to: { name: 'permission-demo-roles' }, class: `${base} ${rolesActive ? active : ''}` },
    { label: '使用者清單', to: { name: 'permission-demo-users' }, class: `${base} ${usersActive ? active : ''}` },
    {
      label: '按鈕示範',
      to: { name: 'permission-demo-playground' },
      class: `${base} ${playgroundActive ? active : ''}`,
    },
  ]
})
</script>

<template>
  <div>
    <nav class="border-border mb-6 flex flex-wrap gap-2 border-b pb-4" aria-label="權限示範子選單">
      <RouterLink v-for="item in links" :key="item.label" :to="item.to" :class="item.class">
        {{ item.label }}
      </RouterLink>
    </nav>
    <RouterView />
  </div>
</template>
