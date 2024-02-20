<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ProductServiceClient } from '~/client_api/productServiceClient';
import { ddl } from '~/server/mockdata/dropdown';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const route = useRoute()
const router = useRouter()
const submitted = ref(false)
const statuses = ref(ddl.statuses);
const category = ref(ddl.category);
const product = ref({
    id: '',
    code: '',
    image: '',
    name: '',
    description: '',
    status: '',
    category: '',
    price: '',
    quantity: '',
    rating: 0,
})

const saveProduct = () => {
    submitted.value = true;

    product.value.id = createId();
    product.value.code = createId();
    product.value.image = 'product-placeholder.svg';
    product.value.status = product.value.status ? (product.value.status).toUpperCase() : 'INSTOCK';

    ProductServiceClient.addProducts(product.value)

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000 });
    hide()
}

const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const hide = () => {
    router.replace('/product/stock')
}

const modelValue = computed({
    get() {
        return route.fullPath.split('/').pop()?.toLocaleLowerCase() === 'new'
    },
    set(value: any) {
        if (!value) router.replace('/product/stock')
    },
})
</script>
<template>
    <KTBDialog v-model="modelValue" header="Add Products" class="p-fluid" @on-click-no="hide" @on-click-yes="saveProduct">
        <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
            :alt="product.image" class="block m-auto pb-3" />

        <KTBInputText v-model.trim="product.name" label="Product name" name="productName" />
        <KTBInputTextarea v-model="product.description" label="Description" />
        <KTBDropdown v-model="product.status" label="Status" :item-list="statuses" placeholder="Please select a status"
            searchable required :is-submit="submitted" />
        <KTBDropdown v-model="product.category" label="Category" :item-list="category" placeholder="Please select a status"
            searchable required :is-submit="submitted" />
        <KTBInputNumber v-model="product.price" label="Price" :decimal="2" />
        <KTBInputNumber v-model="product.quantity" label="Quantity" />
    </KTBDialog>
    <Toast />
</template>
<style scoped></style>