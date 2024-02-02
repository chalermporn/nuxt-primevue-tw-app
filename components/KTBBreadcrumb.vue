<script setup lang="ts">
defineProps({
    breadcrumbs: {
        type: Array,
        required: true,
    },
});

const home = ref({
    icon: 'pi pi-home',
    route: '/introduction'
});
</script>
<template>
    <Breadcrumb :home="home" :model="breadcrumbs" :pt="{ root: 'border-none' }">
        <template #item="{ item }">
            <NuxtLink :to="item.to">
                <span :class="[item.icon, 'text-color']" />
                <span class="">{{ item.text }}</span>
            </NuxtLink>
        </template>
    </Breadcrumb>
</template>
<style scoped></style> 