<script setup lang="ts">
import Topbar from "../components/Topbar"
import Sidebar from "../components/Sidebar"
import PageLayout from "../layouts/PageLayout"

const items = ref([
  {
    key: '0',
    label: 'Product',
    icon: 'pi pi-slack',
    badge: 5,
    expanded: false, // Add expanded property
    items: [
      {
        key: '0_2',
        label: 'Stocks',
        url: '/product/stock',
        icon: '',
        badge: 0,
      },
    ],
  },
]);

</script>

<template>
  <div id="mainLayout" :class="[
    'max-md:min-h-screen',
  ]">
    <header>
      <Topbar :menu-items="items" />
    </header>
    <aside class="max-sm:hidden">
      <Sidebar :menu-items="items" />
    </aside>
    <main>
      <slot class="h-full" />
    </main>
  </div>
</template>

<style scoped>
/* @media (min-width: 768px) { */
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

/* } */
</style>