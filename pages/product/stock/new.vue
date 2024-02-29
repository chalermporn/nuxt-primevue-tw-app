<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ProductServiceClient } from '~/client_api/productServiceClient';
import { ddl } from '~/server/mockdata/dropdown';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { helpers } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()
const { showSuccessToast } = useCustomToast()
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
    price: 0,
    quantity: 0,
    rating: 0,
})

const rules = computed(() => ({
    name: { required: helpers.withMessage('Product name is required', required) },
    description: { required: helpers.withMessage('Description is required', required) },
    status: { required: helpers.withMessage('Status is required', required) },
    category: { required: helpers.withMessage('Category is required', required) },
    price: { required: helpers.withMessage('Price is required', required) },
    quantity: { required: helpers.withMessage('Quantity is required', required) },
}))

const v$ = useVuelidate(rules.value, product.value)

const saveProduct = () => {
    submitted.value = true;
    if (v$.value.$invalid) return false

    product.value.id = createId();
    product.value.code = createId();
    product.value.image = 'product-placeholder.svg';
    product.value.status = product.value.status ? (product.value.status).toUpperCase() : 'INSTOCK';

    ProductServiceClient.addProducts(product.value)

    showSuccessToast('Added successfully', 'you have added a new product')
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

        <KTBInputText v-model.trim="product.name" label="Product name" name="productName" required :is-submit="submitted"
            :validate="v$.name" />
        <KTBInputTextarea v-model="product.description" label="Description" required :is-submit="submitted"
            :validate="v$.description" />
        <KTBDropdown v-model="product.status" label="Status" :item-list="statuses" placeholder="Please select a status"
            searchable required :is-submit="submitted" :validate="v$.status" />
        <KTBDropdown v-model="product.category" label="Category" :item-list="category" placeholder="Please select a status"
            searchable required :is-submit="submitted" :validate="v$.category" />
        <KTBInputNumber v-model="product.price" label="Price" :decimal="2" required :is-submit="submitted"
            :validate="v$.price" />
        <KTBInputNumber v-model="product.quantity" label="Quantity" required :is-submit="submitted"
            :validate="v$.quantity" />
    </KTBDialog>
    <KTBToast />
</template>
<style scoped></style>