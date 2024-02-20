<script setup>
const items = ref([
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

const isShowSidebar = ref(false)
</script>

<template>
  <div id="mainLayout" :class="[
    'max-md:min-h-screen',
  ]">
    <MainTopbar @toggle-sidebar="isShowSidebar = !isShowSidebar" />
    <MainSidebar :menu-items="items" :is-show-sidebar="isShowSidebar" />
    <main>
      <slot class="h-full" />
    </main>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  #mainLayout {
    display: grid;
    height: 100dvh;

    grid-template-areas: "header header" "sidebar main";
    grid-template-columns: auto 5fr;
    grid-template-rows: var(--header-nav-height) auto;
  }

  #mainLayout header {
    grid-area: header;
  }

  #mainLayout aside {
    grid-area: sidebar;
  }

  #mainLayout main {
    overflow: auto;
    grid-area: main;
  }

}
</style>