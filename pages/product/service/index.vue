<script setup>

const route = useRoute()
const breadcrumbs = computed(() => {
    const routeItems = route.fullPath.split('/').filter(Boolean);
    const breadcrumbItems = [];

    for (let i = 0; i < routeItems.length; i++) {
        const to = i === routeItems.length - 1 ? '/' : `/${routeItems[i]}`;

        breadcrumbItems.push({
            text: routeItems[i].charAt(0).toUpperCase() + routeItems[i].slice(1),
            to,
        });
    }
    return breadcrumbItems;
});

const { data } = await useFetch('https://dummyjson.com/carts')
</script>

<template>
    <PageLayout page-title="Service" :breadcrumbs="breadcrumbs">
        <div v-for="product in data.carts" :key="product.id">
            <!-- <img :src="product.thumbnail" /> -->
            {{ product }}
        </div>
    </PageLayout>
</template>

<style scoped></style>