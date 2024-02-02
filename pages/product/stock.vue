<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import ProductService from '../../server/api/productService';
import PageLayout from "../../layouts/PageLayout"
import KTBInputText from '~/components/KTBInputText.vue';
import KTBInputNumber from '~/components/KTBInputNumber.vue';
import KTBInputTextarea from '~/components/KTBInputTextarea.vue';
import KTBDropdown from '~/components/KTBDropdown.vue';
import KTBDialog from '~/components/KTBDialog.vue';


onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Price High to Low', value: 'price' },
    { label: 'Price Low to High', value: '!price' },
]);
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const category = ref([
    { label: 'Accessories', value: 'accessories' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Fitness', value: 'fitness' },
]);
const pageTitle = 'Stock';
const breadcrumbs = [
    {
        text: 'Product',
        to: '/product',
    },
    {
        text: 'Stock',
        to: '/product/stock',
    },
];

// functions
const formatCurrency = (value) => {
    if (value)
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
};
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = () => {
    submitted.value = true;

    if (product.value.name.trim()) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? (product.value.inventoryStatus).toUpperCase() : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        productDialog.value = false;
        product.value = {};
    }
};
const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};
const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};
const deleteProduct = () => {
    products.value = products.value.filter(val => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const exportCSV = () => {
    dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter(val => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

const sortedProducts = computed(() => {
    if (!sortKey.value) {
        return products.value;
    }

    const sorted = [...products.value].sort((a, b) => {
        const aValue = a[sortField.value];
        const bValue = b[sortField.value];

        if (typeof aValue === 'string') {
            return aValue.localeCompare(bValue) * sortOrder.value;
        } else {
            return (aValue - bValue) * sortOrder.value;
        }
    });

    return sorted;
});
</script>
<template>
    <PageLayout :page-title="pageTitle" :breadcrumbs="breadcrumbs">
        <!-- # region datalist table -->
        <div class="hidden xl:flex flex-col gap-4">
            <div class="flex justify-between">
                <div class="flex gap-4">
                    <KTBButton label="New" icon="pi pi-plus" type="contained" bg-color="bg-green-700"
                        text-color="text-white" @click="openNew" />
                    <KTBButton label="Delete" icon="pi pi-trash" type="contained" bg-color="bg-red-700"
                        text-color="text-white dark:text-white" :disabled="!selectedProducts || !selectedProducts.length"
                        @click="deleteProduct" />
                </div>
                <div>
                    <KTBInputText v-model="filters['global'].value" name="searchBox" placeholder="Search..." />
                </div>
            </div>

            <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                :pt="{ thead: 'bg-green-700 text-white' }" :rows="5" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img class="rounded-md"
                            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
                            :alt="slotProps.data.image" style="width: 64px" />
                    </template>
                </Column>
                <Column field="name" header="Name" sortable style="min-width:12rem"></Column>

                <Column field="price" header="Price" sortable style="min-width:8rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="category" header="Category" sortable style="min-width:10rem"></Column>
                <Column field="rating" header="Reviews" sortable style="min-width:4rem">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                    </template>
                </Column>
                <Column field="inventoryStatus" header="Status" sortable style="min-width:10rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.inventoryStatus"
                            :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                    </template>
                </Column>
                <Column :exportable="false" class="min-w-20 w-20">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <KTBButton icon="pi pi-pencil" type="outlined" border-color="border-gray-700"
                                text-color="text-gray-700 dark:text-white" @click="editProduct(slotProps.data)" />
                            <KTBButton icon="pi pi-trash" type="outlined" border-color="border-red-700"
                                text-color="text-red-700 dark:text-white" @click="confirmDeleteProduct(slotProps.data)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- # end region datalist table -->

        <!-- #region dialog -->
        <KTBDialog v-model:visible="productDialog" header="Add Products" class="p-fluid" @on-click-no="hideDialog"
            @on-click-yes="saveProduct">
            <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
                :alt="product.image" class="block m-auto pb-3" />

            <KTBInputText v-model.trim="product.name" label="Product name" name="productName" />
            <KTBInputTextarea v-model="product.description" label="Description" />
            <KTBDropdown v-model="product.inventoryStatus" label="Inventory status" :item-list="statuses"
                placeholder="Please select a status" searchable required :is-submit="submitted" />
            <KTBDropdown v-model="product.category" label="Category" :item-list="category"
                placeholder="Please select a status" searchable required :is-submit="submitted" />
            <KTBInputNumber v-model="product.price" label="Price" decimal="2" />
            <KTBInputNumber v-model="product.quantity" label="Quantity" />
        </KTBDialog>

        <KTBDialog v-model:visible="deleteProductDialog" @on-click-no="deleteProductDialog = false"
            @on-click-yes="deleteProduct">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
            </div>
        </KTBDialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
        <!-- #end region dialog -->


        <!-- # region dataview  -->
        <div class="flex flex-col xl:hidden">
            <DataView :value="products" paginator :rows="5">
                <template #header>
                    <div class="flex justify-between">
                        <div class="flex gap-4">
                            <KTBButton label="New" icon="pi pi-plus" type="contained" bg-color="bg-green-700"
                                text-color="text-white" @click="openNew" />
                        </div>

                        <KTBInputText v-model="filters['global'].value" name="searchBox" placeholder="Search..." />
                    </div>
                </template>
                <template #list="slotProps">
                    <div class="flex flex-wrap">
                        <div v-for="( item, index ) in  slotProps.items " :key="index" class="w-full">
                            <div class="flex flex-row items-start p-4 gap-4"
                                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                                <img class="w-40 shadow-md block mx-auto rounded"
                                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                                    :alt="item.name" />
                                <div
                                    class="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
                                    <div class="flex flex-col items-center sm:items-start gap-3">
                                        <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ item.name }}
                                        </div>
                                        <Rating :modelValue="item.rating" readonly :cancel="false"></Rating>
                                        <div class="flex items-center gap-3">
                                            <span class="flex items-center gap-2">
                                                <i class="pi pi-tag"></i>
                                                <span class="font-semibold">{{ item.category }}</span>
                                            </span>
                                            <Tag :value="item.inventoryStatus"></Tag>
                                        </div>
                                    </div>
                                    <div class="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                                        <span class="text-2xl font-semibold">${{ item.price }}</span>
                                        <div class="min-w-12 w-12">
                                            <KTBButton icon="pi pi-trash" type="outlined" border-color="border-red-700"
                                                text-color="text-red-700 dark:text-white"
                                                :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                                                @click="confirmDeleteProduct(item)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <!-- # region dataview  -->
    </PageLayout>
</template>
