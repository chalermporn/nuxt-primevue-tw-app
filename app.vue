<script setup lang="ts">
import { provide } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const colorMode = useColorMode()
provide('colorMode', colorMode)

const breakpoints = useBreakpoints(breakpointsTailwind)
provide('screen', {
  isSm: breakpoints.greaterOrEqual('sm'),
  isMd: breakpoints.greaterOrEqual('md'),
  isLg: breakpoints.greaterOrEqual('lg'),
  isXl: breakpoints.greaterOrEqual('xl'),
  isMaxSm: breakpoints.smallerOrEqual('sm'),
  isMaxMd: breakpoints.smallerOrEqual('md'),
  isMaxLg: breakpoints.smallerOrEqual('lg'),
  isMaxXl: breakpoints.smallerOrEqual('xl'),
})

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
