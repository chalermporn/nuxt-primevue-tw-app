<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const isShowSidebar = ref(true)

const close = () => {
    router.replace('/product/stock')
}
</script>
<template>
    <Offcanvas v-model="isShowSidebar" tagName="aside" position="right" size="medium" class="bg-white shadow-2xl" alwaysShow
        @close="close">
        <template #title>
            <slot name="title" />
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
