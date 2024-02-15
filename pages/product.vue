<script setup>
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import ProductService from '~/server/api/productService';
import { ddl } from '~/server/mockdata/dropdown';

const toast = useToast();
const router = useRouter()
const dt = ref();
const products = ref();
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
const columns = ref(ddl.displayTableColumn);
const selectedColumns = ref(columns.value);

const showFilter = ref(false);
const ddlFilter = ref(ddl.filterOptions)
// const ddlFilterShowBy = ref([{ label: 'All', value: '' }, ...ddl.category])
const ddlFilterShowBy = ref(ddl.category)
const filterFieldAscDsc = ref();
const filterFieldCategory = ref(ddlFilterShowBy.value[0]);

const totalRecords = ref(0)
const rowPerPage = ref(5);
const ddlRowPerPage = ref(ddl.rowPerPage)
const page = ref(1)

watch(() => products.value, (total) => {
  totalRecords.value = total.length || 0;
})


const onRowPerPageChanged = () => {
  rowPerPage.value = rowPerPage.value
  getProducts()
}

const onPageChange = (e) => {
  page.value = e.page + 1
  getProducts()
}

const onFilterShowByChange = (order) => {
  if (!filterFieldAscDsc.value) return
  getProducts(order, filterFieldAscDsc.value || '')
}

const onFilterCategoryChange = () => {
  getProducts('asc', 'category')
}

const getProducts = (order, filterField) => {
  ProductService.getProductsByPaging(page.value, rowPerPage.value, order, filterField).then((data) => {
    products.value = data;
  });
}


// functions
const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return;
};
const openNew = () => {
  router.push('/product/stock/new')
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
  getProducts()
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
          <KTBButton class="hidden xl:block" label="Delete" icon="pi pi-trash" type="contained" bg-color="bg-red-700"
            text-color="text-white dark:text-white" :disabled="!selectedProducts || !selectedProducts.length"
            @click="deleteProduct" />
        </div>
        <div class="flex gap-2">
          <KTBInputText v-model="filters['global'].value" name="searchBox" placeholder="Search..." />

          <div class="min-w-12 w-12">
            <KTBButton icon="pi pi-filter" type="contained" bg-color="bg-gray-200"
              text-color="text-gray-700 dark:text-white" @click="showFilter = true" />
          </div>
        </div>
      </div>

      <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" resizableColumns columnResizeMode="fit"
        showGridlines dataKey="id" :paginator="false" :rows="rowPerPage" :filters="filters" :sort-field="'rating'"
        sort-order="1" :pt="{ thead: 'bg-green-700 text-white', bodyrow: 'cursor-pointer' }"
        @row-click="viewDetail($event.data.id)">
        <template #header>
          <div style="text-align:left">
            <KTBMultiSelect v-model="selectedColumns" :options="columns" optionLabel="header" />
          </div>
        </template>
        <Column selectionMode=" multiple" style="width: 3rem" :exportable="false">
        </Column>

        <Column v-for="(col, index) of  selectedColumns " :field="col.field" :header="col.header"
          :sortable="col.field !== 'image'" :key="col.field + '_' + index" :style="{ minWidth: `${col.minWidth}` }">
          <template #body="slotProps">
            <img v-if="col.field === 'image'" class="max-w-20 rounded"
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" />
            <div v-else-if="col.field === 'price'">{{ formatCurrency(slotProps.data.price) }}</div>
            <Rating v-else-if="col.field === 'rating'" :modelValue="slotProps.data.rating" :readonly="true"
              :cancel="false" />
            <Tag v-else-if="col.field === 'inventoryStatus'" :value="slotProps.data.inventoryStatus"
              :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
            <div v-else>{{ slotProps.data[col.field] }}</div>
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <div class="min-w-12 w-12 flex gap-2">
              <KTBButton icon="pi pi-trash" type="outlined" border-color="border-red-700"
                text-color="text-red-700 dark:text-white" @click.stop="confirmDeleteProduct(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
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
      <DataView :value="products" :paginator="false" :rows="5">
        <template #list="slotProps">
          <div class="flex flex-wrap">
            <div v-for="(  item, index  ) in   slotProps.items  " :key="index" class="w-full">
              <div class="py-4 flex flex-row items-start gap-4 cursor-pointer" @click.stop="viewDetail(item.id)"
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
                      <KTBButton class="w-full" icon="pi pi-trash" type="outlined" border-color="border-red-700"
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

    <Paginator class="mt-4" :rows="rowPerPage" :totalRecords="30"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      :pt="{ root: 'flex flex-wrap justify-start items-center', start: 'order-first me-auto', end: 'order-last ms-auto' }"
      @page="onPageChange($event)">
      <template #start>
        Total 30 products ({{ totalRecords }} per page)
      </template>
      <template #end>
        <KTBDropdown v-model="rowPerPage" :item-list="ddlRowPerPage" @update:model-value="onRowPerPageChanged" />
      </template>
    </Paginator>

    <Offcanvas v-model="showFilter" tagName="aside" position="right" size="medium" class="bg-white dark:bg-black"
      noBackdrop @close="showFilter = false">
      <template #title>Filter</template>
      <template #post-title>
        <KTBButton icon="pi pi-filter-slash" label="Clear filter" type="outlined" border-color="border-gray-700"
          text-color="text-gray-700 dark:text-white" @click="editProduct" />
      </template>
      <div class="p-4 h-full flex flex-col gap-3">
        <h2 class="text-gray-400">Sorting</h2>
        <div>
          <KTBDropdown v-model="filterFieldAscDsc" label="Order column" :item-list="ddlFilter"
            placeholder="Please select a filter column" :is-submit="submitted" />

          <div class="mt-3 flex gap-1">
            <KTBButton label="Ascending" icon="pi pi-sort-amount-down" type="contained" bg-color="bg-gray-200"
              text-color="text-gray-700 dark:text-white" @click="onFilterShowByChange('asc')" />
            <KTBButton label="Descending" icon="pi pi-sort-amount-up-alt" type="outlined" border-color="border-gray-700"
              text-color="text-gray-700 dark:text-white" @click="onFilterShowByChange('dsc')" />
          </div>
        </div>
        <hr />
        <div>
          <KTBDropdown v-model="filterFieldCategory" label="Show by category" :item-list="ddlFilterShowBy"
            placeholder="Please select a filter column" :is-submit="submitted"
            @update:model-value="onFilterCategoryChange()" />
        </div>
      </div>
    </Offcanvas>
  </PageLayout>
</template>
