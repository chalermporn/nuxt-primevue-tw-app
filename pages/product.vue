<script setup>
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { ProductServiceClient } from '~/client_api/productServiceClient';
import { ddl } from '~/server/mockdata/dropdown';

const router = useRouter()
const { showSuccessToast } = useCustomToast()
const dt = ref();
const products = ref([{
  id: '',
  code: '',
  name: '',
  description: '',
  image: '',
  price: 0,
  category: '',
  quantity: 0,
  status: '',
  rating: 5
},]);
const deleteProductDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const first = ref(0);
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const pageTitle = 'Stock';
const menu = ref([
  {
    key: '0',
    label: 'Product',
    icon: 'pi pi-slack',
    badge: 5,
    items: [
      {
        key: '0_1',
        label: 'Stocks',
        url: '/product/stock',
        icon: '',
        badge: 0,
      },
    ],
  },
]);

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

const columns = ref(ddl.displayTableColumn);
const selectedColumns = ref(columns.value);

const isTableDataLoading = ref(true)
const showFilter = ref(false);
const ddlFilter = ref(ddl.filterOptions)
const ddlFilterShowBy = ref(ddl.filterOptionsShowBy)
const filterOrder = ref(); //asc dsc
const filterOrderCol = ref(); //ddl filter order column
const filterType = ref() //name price category rating
const filterByCategory = ref(ddlFilterShowBy.value[0].value);
const filtersSearchBox = ref('')

const recordPerPage = ref(5)
const totalElement = ref(0)
const ddlRowPerPage = ref(ddl.rowPerPage)
const rowPerPage = ref(5);
const page = ref(1)

const isDisplay = (fields) => {
  return selectedColumns.value.some(field => field.field.includes(fields));
}

const onSearch = (e) => {
  getProducts()
}

const onRowPerPageChanged = () => {
  rowPerPage.value = rowPerPage.value
  getProducts()
}

const onPageChange = (e) => {
  page.value = e.page + 1
  getProducts()
}

const onSort = (e) => {
  filterOrderCol.value = e.sortField.charAt(0).toUpperCase() + e.sortField.slice(1);
}

const onFilterShowByChange = (order) => {
  if (!filterOrderCol.value) return
  filterOrder.value = order
  getProducts()
}

const onFilterCategoryChange = () => {
  filterType.value = 'category'
  getProducts()
}

const clearFilter = () => {
  page.value = 1
  first.value = 0
  rowPerPage.value = 5
  filterOrder.value = ''
  filterOrderCol.value = ''
  filterType.value = ''
  filterByCategory.value = ddlFilterShowBy.value[0].value
  filtersSearchBox.value = ''

  getProducts()
}

const getProducts = () => {
  isTableDataLoading.value = true
  setTimeout(() => {
    ProductServiceClient.getProductsByPaging(page.value, rowPerPage.value, filterOrder.value, filterOrderCol.value, filterType.value, filterByCategory.value, filtersSearchBox.value).then((data) => {
      products.value = data.products;
      totalElement.value = data.totalElement;
      isTableDataLoading.value = false
    });
  }, 1000)
}

provide('getProducts', getProducts);

watch(() => products.value, (total) => {
  recordPerPage.value = total.length || 0;
})

const sortOrder = computed(() => {
  if (!filterOrder.value) return null
  return filterOrder.value === 'asc' ? 1 : -1
})

const filterCount = computed(() => {
  if (!filterByCategory.value && !filterOrderCol.value) return 0

  if (filterByCategory.value !== 'All') {
    if (filterOrderCol.value) return 2
    return 1
  } else {
    if (filterOrderCol.value) return 1
  }
})


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
  deleteProductDialog.value = false;
  ProductServiceClient.deleteProducts(product.value.id)
  showSuccessToast('Deleted successfully', `you have updated product id ${product.value.id}`)
  getProducts()
};

const deleteSelectedProducts = () => {
  ProductServiceClient.deleteSelectedProducts(selectedProducts.value)

  for (let selectedProduct of selectedProducts.value) {
    showSuccessToast('Deleted successfully', `you have updated product id ${selectedProduct.id}`)
  }
  getProducts()
};

const getStatusLabel = (status) => {
  return helpers.getStatusLabel(status)
};

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
    <KTBToast />
    <!-- # region datalist table -->
    <section>
      <div class="relative flex gap-4 justify-between">
        <div class="flex gap-4">
          <KTBButton label="New" icon="pi pi-plus" type="contained" bg-color="bg-green-700" text-color="text-white"
            @click="openNew" />
          <KTBButton class="hidden xl:block" label="Delete" icon="pi pi-trash" type="contained" bg-color="bg-red-700"
            text-color="text-white dark:text-white" :disabled="!selectedProducts || !selectedProducts.length"
            @click="deleteSelectedProducts" />
        </div>
        <div class="flex gap-2">
          <KTBInputText v-model="filtersSearchBox" name="searchBox" placeholder="Search..." @keyup.enter="onSearch" />

          <div class="min-w-12 w-12">
            <KTBButton icon="pi pi-filter" type="contained" bg-color="bg-gray-200"
              text-color="text-gray-700 dark:text-black" @click="showFilter = true" />
          </div>
        </div>
        <div v-show="filterCount"
          class="absolute top-0 right-1 w-5 h-5 flex justify-center items-center bg-green-700 text-sm text-white rounded-full p-1">
          {{ filterCount }}</div>
      </div>
    </section>
    <!-- # region datalist table -->
    <section class="hidden xl:flex flex-col gap-4">
      <div>
        <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" resizableColumns columnResizeMode="fit"
          :sort-field="(filterOrderCol)?.toLowerCase()" :sort-order="sortOrder" showGridlines dataKey="id"
          :paginator="false" :rows="rowPerPage" :filters="filters"
          :pt="{ thead: 'bg-green-700 text-white', bodyrow: 'cursor-pointer' }"
          :ptOptions="{ mergeSections: true, mergeProps: true }" @row-click="viewDetail($event.data.id)" @sort="onSort">
          <template #header>
            <div style="text-align:left">
              <KTBMultiSelect v-model="selectedColumns" :options="columns" optionLabel="header" />
            </div>
          </template>

          <template #empty>
            <div class="my-5 text-center">No products found.</div>
          </template>

          <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />

          <Column v-for="(col, index) of  selectedColumns " :field="col.field" :header="col.header"
            :sortable="col.field !== 'image'" :key="col.field + '_' + index" :style="{ minWidth: `${col.minWidth}` }">
            <template #body="slotProps">
              <template v-if="isTableDataLoading">
                <KTBLoadingSkeleton />
              </template>
              <template v-else>
                <img v-if="col.field === 'image'" class="max-w-20 rounded"
                  :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" />
                <div v-else-if="col.field === 'price'">{{ formatCurrency(slotProps.data.price) }}</div>
                <Rating v-else-if="col.field === 'rating'" :modelValue="slotProps.data.rating" :readonly="true"
                  :cancel="false" />
                <Tag v-else-if="col.field === 'status'" :modelValue="slotProps.data.status" :value="slotProps.data.status"
                  :severity="getStatusLabel(slotProps.data.status)" />
                <div v-else>{{ slotProps.data[col.field] }}</div>
              </template>
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
    </section>
    <!-- # end region datalist table -->

    <KTBDialog v-model="deleteProductDialog" @on-click-no="deleteProductDialog = false" @on-click-yes="deleteProduct">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>
    </KTBDialog>
    <!-- #end region dialog -->

    <!-- # region dataview  -->
    <div class="flex flex-col xl:hidden">
      <DataView :value="products" :paginator="false" :rows="5">
        <template #header>
          <div style="text-align:left">
            <KTBLoadingSkeleton v-if="isTableDataLoading" width="270px" />
            <KTBMultiSelect v-else v-model="selectedColumns" :options="columns" optionLabel="header" />
          </div>
        </template>
        <template #list="slotProps">
          <div class="flex flex-wrap">
            <template v-if="isTableDataLoading">
              <div v-for="index in recordPerPage" :key="index" class="w-full">
                <div class="px-0 py-4 sm:p-4 flex flex-col sm:flex-row items-start gap-4 cursor-pointer"
                  :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                  <KTBLoadingSkeleton class="shadow-md block mx-auto sm:!w-[160px] max-sm:!w-[240px]" height="106.66px" />
                  <div class="w-60 mx-auto flex flex-col gap-4 sm:flex-row justify-between items-start flex-1">
                    <div class="flex flex-col items-start gap-3">
                      <KTBLoadingSkeleton width="141px" />
                      <KTBLoadingSkeleton width="121px" />
                      <div class="flex items-center gap-3">
                        <span class="flex items-center gap-2">
                          <KTBLoadingSkeleton width="16px" shape="circle" />
                          <KTBLoadingSkeleton />
                        </span>
                        <KTBLoadingSkeleton />
                      </div>
                    </div>
                    <div
                      class="w-full flex flex-row justify-between items-center sm:flex-col  sm:items-end gap-3 sm:gap-2">
                      <KTBLoadingSkeleton />
                      <KTBLoadingSkeleton width="48px" height="42px" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-for="(  item, index  ) in   slotProps.items  " :key="index" class="w-full">
                <div class="px-0 py-4 sm:p-4 flex flex-col sm:flex-row items-start gap-4 cursor-pointer"
                  @click.stop="viewDetail(item.id)"
                  :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                  <img v-show="isDisplay('image')" class="w-60 sm:w-40 shadow-md block mx-auto rounded"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" />
                  <div class="w-60 mx-auto flex flex-col gap-4 sm:flex-row justify-between items-start flex-1">
                    <div class="flex flex-col items-start gap-3">
                      <div v-show="isDisplay('name')" class="text-2xl font-bold text-surface-900 dark:text-surface-0">
                        {{ item.name }}</div>
                      <Rating v-show="isDisplay('rating')" :modelValue="item.rating" readonly :cancel="false"></Rating>
                      <div class="flex items-center gap-3">
                        <span v-show="isDisplay('category')" class="flex items-center gap-2">
                          <i class="pi pi-tag"></i>
                          <span class="font-semibold">{{ item.category }}</span>
                        </span>
                        <Tag v-show="isDisplay('status')" :value="item.status"
                          :severity="getStatusLabel(item.status) || undefined"></Tag>
                      </div>
                    </div>
                    <div
                      class="w-full flex flex-row justify-between items-center sm:flex-col  sm:items-end gap-3 sm:gap-2">
                      <span v-show="isDisplay('price')" class="text-2xl font-semibold">${{ item.price }}</span>
                      <div class="min-w-12 w-12">
                        <KTBButton class="w-full" icon="pi pi-trash" type="outlined" border-color="border-red-700"
                          text-color="text-red-700 dark:text-white" :disabled="item.status === 'OUTOFSTOCK'"
                          @click.stop="confirmDeleteProduct(item)" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </DataView>
    </div>
    <!-- # region dataview  -->

    <div
      class="mt-4 max-xl:mx-auto max-xl:sticky max-xl:bottom-4 max-xl:w-[fit-content] max-xl:rounded-lg max-xl:shadow-sm max-xl:shadow-black dark:shadow-white">
      <KTBPaginator class="hidden xl:block" v-model:first="first" :rows="rowPerPage" :totalRecords="totalElement"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        :pt="{ root: 'flex flex-wrap justify-start items-center', start: 'order-first me-auto', end: 'order-last ms-auto' }"
        @onPageChange="onPageChange($event)">
        <template #start>
          Total {{ totalElement }} products ({{ recordPerPage }} per page)
        </template>
        <template #end>
          <KTBDropdown v-model="rowPerPage" :item-list="ddlRowPerPage" @update:model-value="onRowPerPageChanged" />
        </template>
      </KTBPaginator>

      <KTBPaginator class="flex xl:hidden mx-auto bg-white rounded-lg dark:bg-black" v-model:first="first"
        :rows="rowPerPage" :totalRecords="totalElement"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="Showing {first} of {totalRecords}"
        :pt="{ current: 'text-black dark:text-white/80', firstPageButton: 'pr-2.5', previousPageButton: 'px-2.5 sm:px-4', nextPageButton: 'px-2.5 sm:px-4', lastPageButton: 'pl-2.5' }"
        @onPageChange="onPageChange($event)">
        <template #end>
          <div class="ml-4">
            <KTBDropdown class="mx-auto" v-model="rowPerPage" :item-list="ddlRowPerPage"
              @update:model-value="onRowPerPageChanged" />
          </div>
        </template>
      </KTBPaginator>
    </div>

    <Offcanvas v-model="showFilter" tagName="aside" position="right" size="medium" class="bg-white dark:bg-black"
      noBackdrop @close="showFilter = false">
      <template #title>Filter</template>
      <template #post-title>
        <KTBButton icon="pi pi-filter-slash" label="Clear filter" type="outlined"
          border-color="border-gray-700 dark:border-white" text-color="text-gray-700 dark:text-white"
          @click="clearFilter" />
      </template>
      <div class="p-4 h-full flex flex-col gap-3">
        <h2 class="text-gray-400">Sorting</h2>
        <div>
          <KTBDropdown v-model="filterOrderCol" label="Order column" :item-list="ddlFilter"
            placeholder="Please select a filter column" :is-submit="submitted" />

          <div class="mt-3 flex gap-1">
            <KTBButton label="Ascending" icon="pi pi-sort-amount-down" type="contained" bg-color="bg-gray-200"
              text-color="text-gray-700 dark:text-black" @click="onFilterShowByChange('asc')" />
            <KTBButton label="Descending" icon="pi pi-sort-amount-up-alt" type="outlined" border-color="border-gray-700"
              text-color="text-gray-700 dark:text-white dark:border-gray-400" @click="onFilterShowByChange('dsc')" />
          </div>
        </div>
        <hr />
        <div>
          <KTBDropdown v-model="filterByCategory" label="Show by category" :item-list="ddlFilterShowBy"
            placeholder="Please select a filter column" :is-submit="submitted"
            @update:model-value="onFilterCategoryChange()" />
        </div>
      </div>
    </Offcanvas>
  </PageLayout>
</template>