<script lang="ts" setup>
defineProps({
    pageTitle: {
        type: String,
        required: true,
    },
    breadcrumbs: {
        type: Array,
        required: true,
    },
});
</script>
<template>
    <div class="py-4 px-4 h-full flex flex-col gap-4">
        <header class="flex flex-col gap-4">
            <KTBBreadcrumb :breadcrumbs="breadcrumbs" />
            <hr />
            <div class="text-2xl">{{ pageTitle }}</div>
        </header>
        <slot />
    </div>
</template>
<style scoped></style>
