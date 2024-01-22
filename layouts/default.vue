<script setup lang="ts"></script>

<template>
  <div
    id="mainLayout"
    :class="[
      'max-md:min-h-screen',
    ]"
  >
    <header />
    <aside />
    <main>
      <NuxtPage />
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