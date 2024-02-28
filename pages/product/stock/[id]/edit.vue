<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ProductServiceClient } from '~/client_api/productServiceClient';
import { ddl } from '~/server/mockdata/dropdown';
import lodash from 'lodash'

const route = useRoute()
const router = useRouter()
const { showSuccessToast } = useCustomToast()
const routeId = computed(() => String(route.params.id))
const submitted = ref(false)
const statuses = ref(ddl.statuses);
const category = ref(ddl.category);
const closeEvent = ref('')

const productDetail = ref({
    id: '',
    code: '',
    image: '',
    name: '',
    description: '',
    status: '',
    category: '',
    price: 0,
    quantity: 0,
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
    closeEvent.value = 'update'
    ProductServiceClient.updateProduct(productDetail.value)
    showSuccessToast('Updated successfully', `you have updated product id ${routeId.value}`)
    hide()
}

const hide = () => {
    closeEvent.value = closeEvent.value || ''
    router.replace(`/product/stock/${routeId.value}`)
}

const emitCloseEvent = () => {
    router.currentRoute.value.meta.closeEvent = closeEvent.value;
};

onBeforeRouteLeave(emitCloseEvent);

const getProductDetailById = () => {
    ProductServiceClient.getProductDetailById(routeId.value).then((data) => {
        productDetail.value = lodash.cloneDeep(data[0])
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
    <KTBToast />
    <KTBDialog v-model="modelValue" header="Edit Products" class="p-fluid" @on-click-no="hide" @on-click-yes="updateProduct"
        modal-width="650px">
        <div class="flex flex-row gap-4 max-sm:flex-col">
            <div class="w-1/3 max-sm:w-full">
                <img class="mx-auto rounded"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${productDetail.image}`"
                    :alt="productDetail.image" />
            </div>
            <div class=" flex flex-col gap-2 w-2/3 max-sm:w-full">
                <KTBInputText v-model.trim="productDetail.name" label="Product name" name="productName" />
                <KTBInputTextarea v-model="productDetail.description" label="Description" />
                <KTBDropdown v-model="productDetail.status" label="Status" :item-list="statuses"
                    placeholder="Please select a status" searchable required :is-submit="submitted" />
                <KTBDropdown v-model="productDetail.category" label="Category" :item-list="category"
                    placeholder="Please select a status" searchable required :is-submit="submitted" />
                <KTBInputNumber v-model="productDetail.price" label="Price" :decimal="2" />
                <KTBInputNumber v-model="productDetail.quantity" label="Quantity" />
            </div>
        </div>
    </KTBDialog>
</template>