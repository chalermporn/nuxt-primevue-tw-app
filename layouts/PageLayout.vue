<script lang="ts" setup>
import { ref } from "vue";
import KTBBreadcrumb from "../components/KTBBreadcrumb"

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
    <div class="py-4 px-10 h-full flex flex-col gap-4">
        <header class="flex flex-col gap-4">
            <KTBBreadcrumb :breadcrumbs="breadcrumbs" />
            <hr />
            <div class="text-2xl">{{ pageTitle }}</div>
        </header>
        <main>
            <slot />
        </main>
    </div>
</template>
<style scoped></style>
