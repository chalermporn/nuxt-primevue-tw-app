<script setup lang="ts">
import ProductService from '~/server/api/productService';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routeId = computed(() => String(route.params.id))
const productDetail = ref()

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';
    }
};

const editProduct = () => {
    router.push(`${route.fullPath}/edit`)
}

watch(routeId, async (newId) => {
    try {
        const data = await ProductService.getProductDetailById(newId)
        productDetail.value = data[0]
    } catch (error) {
        console.error('Error fetching product detail:', error)
    }
})

onMounted(() => {
    ProductService.getProductDetailById(routeId.value).then((data) => (productDetail.value = data[0]));
});
</script>
<template>
    <PreviewLayout>
        <template #title>
            <div>{{ productDetail?.name }}</div>
        </template>
        <template #post-title>
            <KTBButton icon="pi pi-pencil" label="Edit" type="outlined" border-color="border-gray-700"
                text-color="text-gray-700 dark:text-white" @click="editProduct" />
        </template>
        <div class="flex flex-col gap-3">
            <div class="flex gap-4">
                <img class="w-28 rounded object-cover"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${productDetail?.image}`" />
                <div class="flex flex-col justify-between">
                    <div class="leading-4">
                        <h2 class="font-semibold">{{ productDetail?.name }}</h2>
                        <small>{{ `(ID: ${productDetail?.id})` }}</small>
                    </div>
                    <Tag class="w-[fit-content]" :value="productDetail?.inventoryStatus"
                        :severity="getStatusLabel(productDetail?.inventoryStatus) || undefined" />
                </div>
            </div>
            <hr />
            <h2 class="font-semibold">Details</h2>
            <div>Price: <span class="text-gray-400">{{ `$${productDetail?.price}` }}</span></div>
            <div>Category: <span class="text-gray-400">{{ productDetail?.category.value }}</span></div>
            <div>Quantity: <span class="text-gray-400">{{ productDetail?.quantity }}</span></div>
            <hr />
            <div>Review:
                <Rating :modelValue="productDetail?.rating" :readonly="true" :cancel="false" />
            </div>
            <NuxtPage page-key="child" />
        </div>
    </PreviewLayout>
</template>
<style scoped></style>