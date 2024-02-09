<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const isShowSidebar = ref(true)

const close = () => {
    router.replace('/product/stock')
}
</script>
<template>
    <Offcanvas v-model="isShowSidebar" tagName="aside" position="right" size="medium" class="bg-white dark:bg-black"
        alwaysShow noBackdrop @close="close">
        <template #title>
            <slot name="title" class="text-black dark:text-white" />
        </template>
        <template #post-title>
            <slot name="post-title" />
        </template>
        <div class="p-4 h-full">
            <slot />
        </div>
    </Offcanvas>
</template>
<style scoped></style>
