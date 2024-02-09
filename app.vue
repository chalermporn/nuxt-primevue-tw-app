<script setup lang="ts">
import { provide } from 'vue'

const colorMode = useColorMode()
provide('colorMode', colorMode)

</script>

<template>
  <NuxtLayout name="main-layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss">
body {
  @apply bg-white dark:bg-gray-800 dark:text-gray-200;
}

html,
body {
  @apply h-full;
}
</style>
