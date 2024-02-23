<script setup>
import { ref, inject } from 'vue';

const props = defineProps({
    menuItems: {
        type: Array,
        default: []
    },
    isShowSidebar: {
        type: Boolean,
    }
})

const MODE = {
    DARK: 'dark',
    LIGHT: 'light',
    SYSTEM: 'system'
}

const route = useRoute()
const colorMode = inject('colorMode')
const expandedKeys = ref({});
const isShowSidebar = computed(() => props.isShowSidebar)
const isCollapsed = ref(false);
const activeMenu = computed(() => [...helpers.flatMap(props.menuItems, 'items', 'url', route.path, true)])

const switchMode = (_mode) => {
    if (_mode) {
        colorMode.preference = _mode
    } else {
        if (colorMode.preference === MODE.LIGHT || colorMode.preference === MODE.SYSTEM) {
            colorMode.preference = MODE.DARK
        } else if (colorMode.preference === MODE.DARK) {
            colorMode.preference = MODE.LIGHT
        }
    }
}

onBeforeMount(() => {
    expandedKeys.value = activeMenu.value?.reduce((a, { key }) => ({ ...a, [key]: true }), {})
})
</script>
<template>
    <Offcanvas v-model="isShowSidebar" tagName="aside" position="left" activeScreen="max-md" size="small" hideHeader
        noBackdrop :class="[isCollapsed ? 'sidebar-width-collapse' : 'sidebar-width']">
        <template #wrapper="{ className }">
            <div id="container" :class="className">
                <div :class="[
                    'h-[calc(100dvh-var(--header-nav-height))] p-4 flex flex-col bg-gray-100 dark:bg-black dark:text-white',
                    'transform duration-200',
                ]">
                    <div :class="[
                        'flex items-center',
                        isCollapsed ? 'justify-center' : 'justify-between gap-1.5'
                    ]">
                        <div v-if="!isCollapsed">
                            <div class="flex gap-1.5">
                                <img class="w-7 h-7 rounded-full" src="https://tailwindcss.com/img/card-top.jpg" />
                                <div>Project name</div>
                            </div>
                        </div>
                        <i :pt="{ root: '', icon: 'text-gray-400' }"
                            :class="['pi pi-chevron-left transform duration-200 ease-in', { 'rotate-180 mt-2': isCollapsed }]"
                            @click=" isCollapsed = !isCollapsed" />
                    </div>
                    <div class="overflow-auto scrollbar-hide my-4 md:h-[calc(100% - 68px)]">
                        <PanelMenu v-model:expandedKeys="expandedKeys" :model="menuItems" multiple :pt="{
                            root: ['flex flex-col gap-3'],
                            header: ({ context }) => {
                                return { class: { 'peer': context?.index === 0 } }
                            },
                            toggleablecontent: ({ context }) => {
                                return {
                                    ...(isCollapsed ? {
                                        class: [
                                            'w-40 peer-[&:not(:hover)]:hidden group/toggleablecontent transform',
                                            'bg-white dark:bg-black',
                                            { 'bg-gray-700': context?.focused },
                                            'peer-hover:rounded-r-lg peer-hover:ps-1 peer-hover:pe-4 peer-hover:pt-2 peer-hover:pb-2 peer-hover:!block peer-hover:absolute peer-hover:left-16 peer-hover:-mt-12 peer-hover:bg-gray-0 peer-hover:dark:bg-bluegray-80 peer-hover:shadow-md',
                                            { '!duration-0 !animation-none hover:!block hover:rounded-r-lg hover:absolute hover:left-16 hover:-mt-12 hover:p-1 hover:pe-4 hover:pt-2 hover:pb-2 hover:bg-gray-0 hover:dark:bg-bluegray-80 hover:shadow-md hover:z-10': true },
                                        ],
                                    } : {})
                                }
                            },
                            menucontent: 'border-none',
                            headercontent: () => {
                                return { class: ['text-gray-700 rounded-md dark:text-white'] };
                            },
                            content: ({ context }) => {
                                return { class: ['p-menuitem-content text-gray-400 rounded-md', { 'text-gray-700 dark:text-white': (context.item.item.url && activeMenu?.findLast(e => e.url === context.item.item.url)) }] }
                            },
                        }">
                            <template #item="{ item, root }">
                                <NuxtLink :to="item.url" :class="[
                                    'flex justify-center items-center px-3 py-2 cursor-pointer rounded-md',
                                    { 'ml-7 mt-1': !root && !isCollapsed }
                                ]">
                                    <div class="flex gap-2 mb-1">
                                        <i v-if="item.icon" :class="[
                                            'my-auto',
                                            item.icon
                                        ]" />
                                        <span :class="[
                                            { 'hidden': isCollapsed && root },
                                            { 'font-semibold': item.items }
                                        ]">
                                            {{ item.label }}</span>
                                    </div>
                                    <div :class="[
                                        'flex gap-2',
                                        { 'ml-auto': !isCollapsed }
                                    ]">
                                        <i v-if="item.items?.length" class="my-auto" :class="[
                                            'my-auto',
                                            { '!hidden': root && isCollapsed },
                                            { 'pi pi-chevron-down': !item.expanded },
                                            { 'pi pi-chevron-up': Object.keys(expandedKeys).includes(item.key || '') }
                                        ]" />
                                    </div>
                                </NuxtLink>
                            </template>
                        </PanelMenu>
                    </div>

                    <div class="mt-auto">
                        <template v-if="isCollapsed">
                            <Button class="mx-auto" :icon="colorMode.preference === MODE.DARK ? 'pi pi-moon' : 'pi pi-sun'"
                                :pt="{ root: 'w-10 h-10 rounded-full flex justify-center items-center border border-solid border-gray-700 dark:text-white dark:bg-gray-700' }"
                                @click="switchMode('')" />
                        </template>
                        <template v-else>
                            <div class="flex gap-1">
                                <KTBButton label="Light" icon="pi pi-sun" type="outlined"
                                    border-color="border-gray-700 dark:border-none"
                                    text-color="text-gray-700 dark:text-gray-400" @click="switchMode(MODE.LIGHT)">
                                </KTBButton>
                                <KTBButton label="Dark" icon="pi pi-moon" type="contained"
                                    bg-color="bg-none dark:bg-gray-700" text-color="text-gray-400 dark:text-white"
                                    @click="switchMode(MODE.DARK)">
                                </KTBButton>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </Offcanvas>
</template>
<style>
/* For Webkit-based browsers (Chrome, Safari and Opera) */
.sidebar-width {
    width: var(--sidebar-width);
}

.sidebar-width-collapse {
    width: var(--sidebar-collapse-width);
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}
</style>
