<script setup>
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import ProductService from '~/server/api/productService';
import { ddl } from '~/server/mockdata/dropdown';

const toast = useToast();
const route = useRoute()
const router = useRouter()
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
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(ddl.statuses);
const category = ref(ddl.category);
const rowPerPage = ref('INSTOCK');
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

const routeId = computed(() => route.params.id)


// functions
const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return;
};
const openNew = () => {
  router.push('/product/stock/new')
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

const viewDetail = (id) => {
  router.push(`/product/stock/${id}`);
}

onMounted(() => {
  ProductService.getProductsSmall().then((data) => { products.value = data });
});
</script>
<template>
  <PageLayout :page-title="pageTitle" :breadcrumbs="breadcrumbs">
    <NuxtPage page-key="child" />
    <!-- # region datalist table -->
    <div class="hidden xl:flex flex-col gap-4">
      <div class="flex justify-between">
        <div class="flex gap-4">
          <KTBButton label="New" icon="pi pi-plus" type="contained" bg-color="bg-green-700" text-color="text-white"
            @click="openNew" />
          <KTBButton label="Delete" icon="pi pi-trash" type="contained" bg-color="bg-red-700"
            text-color="text-white dark:text-white" :disabled="!selectedProducts || !selectedProducts.length"
            @click="deleteProduct" />
        </div>
        <div>
          <KTBInputText v-model="filters['global'].value" name="searchBox" placeholder="Search..." />
        </div>
      </div>

      <!-- :paginator="true" :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" -->
      <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
        tableStyle="min-width: 50rem" :pt="{ thead: 'bg-green-700 text-white', bodyrow: 'cursor-pointer' }" :rows="5"
        :filters="filters" @row-click="viewDetail($event.data.id)" :paginator="true" :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column header="Image">
          <template #body="slotProps">
            <img class="w-20 rounded"
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" />
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
            <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
          </template>
        </Column>
        <Column :exportable="false" class="min-w-20 w-20">
          <template #body="slotProps">
            <div class="flex gap-2">
              <KTBButton icon="pi pi-trash" type="outlined" border-color="border-red-700"
                text-color="text-red-700 dark:text-white" @click.stop="confirmDeleteProduct(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- <Paginator :rows="10" :totalRecords="120"
        :pt="{ root: 'flex flex-wrap justify-start items-center', start: 'order-first me-auto', end: 'order-last ms-auto' }">
        <template #start="slotProps">
          Total: {{ slotProps.state.rows }} records
        </template>
        <template #end>
          {{ rowPerPage }}
          <KTBDropdown v-model="rowPerPage"
            :item-list="[{ label: 'INSTOCK', value: 'INSTOCK' }, { label: '10', value: 10 }, { label: '15', value: 15 }]"
            placeholder="" />
        </template>
      </Paginator> -->
    </div>
    <!-- # end region datalist table -->


    <KTBDialog v-model:visible="deleteProductDialog" @on-click-no="deleteProductDialog = false"
      @on-click-yes="deleteProduct">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>
    </KTBDialog>
    <!-- #end region dialog -->

    <!-- # region dataview  -->
    <div class="flex flex-col xl:hidden">
      <DataView :value="products" paginator :rows="5">
        <template #header>
          <div class="flex justify-between">
            <div class="flex gap-4">
              <KTBButton label="New" icon="pi pi-plus" type="contained" bg-color="bg-green-700" text-color="text-white"
                @click="openNew" />
            </div>

            <KTBInputText v-model="filters['global'].value" name="searchBox" placeholder="Search..." />
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-wrap">
            <div v-for="( item, index ) in  slotProps.items " :key="index" class="w-full">
              <div class="p-4 flex flex-row items-start gap-4 cursor-pointer" @click.stop="viewDetail(item.id)"
                :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                <img class="w-40 shadow-md block mx-auto rounded"
                  :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                <div class="flex flex-row justify-between items-start flex-1 gap-4">
                  <div class="flex flex-col items-start gap-3">
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
                  <div class="flex flex-col items-center sm:items-end gap-3 sm:gap-2">
                    <span class="text-2xl font-semibold">${{ item.price }}</span>
                    <div class="min-w-12 w-12">
                      <KTBButton icon="pi pi-trash" type="outlined" border-color="border-red-700"
                        text-color="text-red-700 dark:text-white" :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                        @click.stop="confirmDeleteProduct(item)" />
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
