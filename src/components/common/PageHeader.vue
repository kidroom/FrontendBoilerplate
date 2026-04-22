<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next'

interface Crumb {
  label: string
  to?: string
}

defineProps<{
  title: string
  description?: string
  breadcrumbs?: readonly Crumb[]
}>()
</script>

<template>
  <div class="mb-6 space-y-2">
    <nav
      v-if="breadcrumbs && breadcrumbs.length > 0"
      class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm"
      aria-label="麵包屑"
    >
      <template v-for="(c, i) in breadcrumbs" :key="`${c.label}-${i}`">
        <RouterLink
          v-if="c.to"
          :to="c.to"
          class="hover:text-foreground rounded-sm underline-offset-4 hover:underline"
        >
          {{ c.label }}
        </RouterLink>
        <span v-else class="text-foreground font-medium">{{ c.label }}</span>
        <ChevronRightIcon
          v-if="i < breadcrumbs.length - 1"
          class="text-muted-foreground/60 size-3.5 shrink-0"
          aria-hidden="true"
        />
      </template>
    </nav>
    <div>
      <h1 class="text-foreground text-xl font-semibold tracking-tight md:text-2xl">{{ title }}</h1>
      <p v-if="description" class="text-muted-foreground mt-1 max-w-3xl text-sm leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
