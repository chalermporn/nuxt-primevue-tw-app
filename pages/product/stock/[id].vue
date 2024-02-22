<script setup lang="ts">
import { ProductServiceClient } from '~/client_api/productServiceClient';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routeId = computed(() => String(route.params.id))
const productDetail = ref()
const isLoading = ref(true)

const getStatusLabel = (status: string) => {
    return helpers.getStatusLabel(status)
};

const editProduct = () => {
    router.push(`${route.fullPath}/edit`)
}

const getProducts = inject('getProducts');

onBeforeRouteUpdate((to, from) => {
    if (from.meta.closeEvent === 'update') {
        getProductDetailById()
    }

    if (typeof getProducts === 'function' && from.meta.closeEvent === 'update') getProducts();
});

const getProductDetailById = () => {
    isLoading.value = true
    ProductServiceClient.getProductDetailById(routeId.value).then((data) => {
        setTimeout(() => {
            isLoading.value = false
            productDetail.value = data[0]
        }, 1000)
    });
}

watch(routeId, () => {
    try {
        getProductDetailById()
    } catch (error) {
        console.error('Error fetching product detail:', error)
    }
})

onMounted(() => {
    getProductDetailById()
});
</script>
<template>
    <PreviewLayout>
        <template #title>
            <KTBLoadingSkeleton v-if="isLoading" />
            <div v-else>{{ productDetail?.name }}</div>
        </template>
        <template #post-title>
            <KTBLoadingSkeleton v-if="isLoading" width="88.31px" />
            <KTBButton v-else icon="pi pi-pencil" label="Edit" type="outlined"
                border-color="border-gray-700 dark:border-white" text-color="text-gray-700 dark:text-white"
                @click="editProduct" />
        </template>
        <div class="flex flex-col gap-3">

            <div v-if="isLoading" class="flex gap-4">
                <KTBLoadingSkeleton width="112px" height="74.66px" />
                <div class="flex flex-col justify-between">
                    <div class="">
                        <KTBLoadingSkeleton width="100px" />
                        <KTBLoadingSkeleton class="mt-1" />
                    </div>
                    <KTBLoadingSkeleton />
                </div>
            </div>
            <div v-else class="flex gap-4">
                <img class="w-28 rounded object-cover"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${productDetail?.image}`" />
                <div class="flex flex-col justify-between">
                    <div class="leading-4">
                        <h2 class="font-semibold">{{ productDetail?.name }}</h2>
                        <small>{{ `(ID: ${productDetail?.id})` }}</small>
                    </div>
                    <Tag class="w-[fit-content]" :value="productDetail?.status"
                        :severity="getStatusLabel(productDetail?.status) || undefined" />
                </div>
            </div>
            <hr />
            <div v-if="isLoading" class="flex flex-col gap-3">
                <KTBLoadingSkeleton />
                <KTBLoadingSkeleton class="mt-1" width="100px" />
                <KTBLoadingSkeleton class="mt-1" width="100px" />
                <KTBLoadingSkeleton class="mt-1" width="100px" />
            </div>
            <div v-else class="flex flex-col gap-3">
                <h2 class="font-semibold">Details</h2>
                <div>Price: <span class="text-gray-400">{{ `$${productDetail?.price}` }}</span></div>
                <div>Category: <span class="text-gray-400">{{ productDetail?.category }}</span></div>
                <div>Quantity: <span class="text-gray-400">{{ productDetail?.quantity }}</span></div>
            </div>
            <hr />

            <div v-if="isLoading">
                <KTBLoadingSkeleton />
                <KTBLoadingSkeleton class="mt-1" width="100px" />
            </div>
            <div v-else>
                <div>Review:</div>
                <Rating :modelValue="productDetail?.rating" :readonly="true" :cancel="false" />
            </div>
        </div>
        <NuxtPage page-key="child" />
    </PreviewLayout>
</template>
<style scoped></style>