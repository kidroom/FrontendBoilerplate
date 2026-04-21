<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <!-- 位置預設見 defaultToasterProps.position；單次呼叫可再傳 { position } 覆寫 -->
  <Toaster />
</template>
