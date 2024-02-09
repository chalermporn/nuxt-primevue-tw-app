<script setup>
import { useRoute, useRouter } from 'vue-router'
import ProductService from '~/server/api/productService';
import { ddl } from '~/server/mockdata/dropdown';

const route = useRoute()
const router = useRouter()
const routeId = computed(() => String(route.params.id))
const submitted = ref(false)
const statuses = ref(ddl.statuses);
const category = ref(ddl.category);

const productDetail = ref({
    id: '',
    code: '',
    image: '',
    name: '',
    description: '',
    inventoryStatus: '',
    category: '',
    price: 0,
    quantity: '',
    rating: 0,
})

const modelValue = computed({
    get() {
        return route.fullPath.split('/').pop()?.toLocaleLowerCase() === 'edit'
    },
    set(value) {
        if (!value) router.replace(`/product/stock/${routeId.value}`)
    },
})

const updateProduct = () => {
    router.replace(`/product/stock/${routeId.value}`)
}

const hide = () => {
    router.replace(`/product/stock/${routeId.value}`)
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
    <KTBDialog v-model="modelValue" header="Edit Products" class="p-fluid" @on-click-no="hide" @on-click-yes="updateProduct"
        modal-width="650px">
        <div class="flex gap-4">
            <div class="w-1/3">
                <img class="rounded" :src="`https://primefaces.org/cdn/primevue/images/product/${productDetail.image}`"
                    :alt="productDetail.image" />
            </div>
            <div class="w-2/3 flex flex-col gap-2">
                <KTBInputText v-model.trim="productDetail.name" label="Product name" name="productName" />
                <KTBInputTextarea v-model="productDetail.description" label="Description" />
                <KTBDropdown v-model="productDetail.inventoryStatus" label="Inventory status" :item-list="statuses"
                    placeholder="Please select a status" searchable required :is-submit="submitted" />
                <KTBDropdown v-model="productDetail.category" label="Category" :item-list="category"
                    placeholder="Please select a status" searchable required :is-submit="submitted" />
                <KTBInputNumber v-model="productDetail.price" label="Price" :decimal="2" />
                <KTBInputNumber v-model="productDetail.quantity" label="Quantity" />
            </div>
        </div>
    </KTBDialog>
</template>
<style scoped></style>