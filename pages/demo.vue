<script setup lang="ts">
import type { PanelMenuPassThroughMethodOptions } from 'primevue/panelmenu';

enum Mode {
    DARK = 'dark',
    LIGHT = 'light',
    SYSTEM = 'system'
}

const colorMode = useColorMode()

const items = ref([
    {
        key: '0',
        label: 'Mail',
        icon: 'pi pi-envelope',
        badge: 5,
        expanded: false, // Add expanded property
        items: [
            {
                key: '0_1',
                label: 'Compose',
                icon: 'icon',
                shortcut: 'shortcut',
                items: [
                    {
                        label: 'test'
                    }
                ],
            },
            {
                key: '0_2',
                label: 'Inbox',
                icon: '',
                badge: 0,
            },
            {
                key: '0_3',
                label: 'Sent',
                icon: '',
                shortcut: '',
            },
            {
                key: '0_4',
                label: 'Trash',
                icon: '',
                shortcut: '',
            },
        ],
    },
    {
        key: '1',
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        shortcut: '',
        expanded: false, // Add expanded property
        items: [
            {
                key: '1_1',
                label: 'Sales',
                icon: '',
                badge: 0,
            },
            {
                key: '1_2',
                label: 'Products',
                icon: '',
                badge: 0,
            },
        ],
    },
    {
        key: '2',
        label: 'Profile',
        icon: 'pi pi-user',
        shortcut: '',
        expanded: false, // Add expanded property
        items: [
            {
                key: '2_1',
                label: 'Settings',
                icon: '',
                shortcut: '',
            },
            {
                key: '2_2',
                label: 'Privacy',
                icon: '',
                shortcut: '',
            },
        ],
    },
]);
const mode: Ref<Mode> = ref(Mode.DARK)
const expandedKeys = ref({});
const isCollapsed = ref(false);
const inputs: any = {};

items.value.forEach((item) => {
    inputs[`${item.key}`] = ref();
});


const switchMode = (_mode?: string) => {
    if (_mode) {
        colorMode.preference = _mode
    } else {
        if (colorMode.preference === Mode.LIGHT || colorMode.preference === Mode.SYSTEM) {
            colorMode.preference = Mode.DARK
        } else if (colorMode.preference === Mode.DARK) {
            colorMode.preference = Mode.LIGHT
        }
    }
}
</script>
<template>
    <div id="container" class="p-4 bg-pink-100 h-full min-h-screen">
        <div :class="[
            'h-[660px] p-4 rounded-xl flex flex-col bg-white dark:bg-black dark:text-white',
            'transform duration-200',
            isCollapsed ? 'w-20' : 'w-56'
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
            <div class="overflow-auto scrollbar-hide my-16 md:h-[calc(100% - 80px)] w-">
                <PanelMenu v-model:expandedKeys="expandedKeys" :model="items" multiple :pt="{
                    root: ['flex flex-col', isCollapsed ? 'gap-4' : ''],
                    header: ({ context }) => {
                        return { class: { 'peer': context?.index === 0 } }
                    },
                    toggleablecontent: (data) => {
                        console.log(data)
                        return {
                            ...(isCollapsed ? {
                                class: [
                                    'w-52 peer-[&:not(:hover)]:hidden group/toggleablecontent transform',
                                    'bg-white dark:bg-black',
                                    { 'bg-gray-700': context?.focused },
                                    'peer-hover:rounded-r-lg peer-hover:ps-1 peer-hover:pe-4 peer-hover:pt-3 peer-hover:pb-4 peer-hover:!block peer-hover:absolute peer-hover:left-16 peer-hover:-mt-12 peer-hover:bg-gray-0 peer-hover:dark:bg-bluegray-80 peer-hover:shadow-md',
                                    { '!duration-0 !animation-none hover:!block hover:rounded-r-lg hover:absolute hover:left-16 hover:-mt-12 hover:p-1 hover:pe-4 hover:pt-3 hover:pb-4 hover:bg-gray-0 hover:dark:bg-bluegray-80 hover:shadow-md hover:z-10': true },
                                ],
                            } : {})
                        }
                    },
                    menucontent: 'border-none',
                    headercontent: ({ context }: PanelMenuPassThroughMethodOptions) => {
                        return { class: ['border-none text-gray-400 rounded-md', { 'bg-gray-700': context.active }] };
                    },
                    content: ({ context }) => {
                        return { class: ['p-menuitem-content text-gray-400 rounded-md', { 'bg-gray-700': context.focused }] }
                    },
                }">
                    <template #item="{ item, root }">
                        <a v-ripple class="p-ripple flex align-items-center px-3 py-2 cursor-pointer rounded-md">
                            <i class="my-auto" :class="[item.icon]" />
                            <span :class="['ml-2', { 'hidden': isCollapsed && root }, { 'font-semibold': item.items }]">
                                {{ item.label }}</span>
                            <div class="ml-auto flex gap-2">
                                <Badge v-if="item.badge"
                                    :class="['min-w-5 h-5 flex justify-center items-center', { 'relative bottom-2 right-1': isCollapsed }]"
                                    :pt="{ root: 'bg-yellow-300 text-gray-800 rounded-sm text-sm' }" :value="item.badge" />
                                <i v-if="item.items?.length" class="my-auto" :class="[
                                    'my-auto',
                                    { '!hidden': root && isCollapsed },
                                    { 'pi pi-chevron-down': !item.expanded },
                                    { 'pi pi-chevron-up': Object.keys(expandedKeys).includes(item.key || '') }
                                ]" />
                            </div>
                        </a>
                    </template>
                </PanelMenu>
            </div>

            <div class="mt-auto">
                <template v-if="isCollapsed">
                    <Button class="mx-auto" :icon="colorMode.preference === Mode.DARK ? 'pi pi-moon' : 'pi pi-sun'"
                        :pt="{ root: 'w-10 h-10 rounded-full flex justify-center items-center border border-solid border-gray-700 dark:text-white dark:bg-gray-700' }"
                        @click="switchMode('')" />
                </template>
                <template v-else>
                    <div class="flex">
                        <Button type="button" label="Light" icon="pi pi-sun" class="py-2 flex-1 text-gray-400 rounded-full"
                            :pt="{ root: 'text-gray-400 border border-solid border-gray-700 dark:text-gray-400 dark:border-none' }"
                            @click="switchMode(Mode.LIGHT)" />
                        <Button type="button" label="Dark" icon="pi pi-moon" class="py-2 flex-1 border-none rounded-full"
                            :pt="{ root: 'text-gray-400 bg-white dark:text-white dark:bg-gray-700' }"
                            @click="switchMode(Mode.DARK)" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style>
/* For Webkit-based browsers (Chrome, Safari and Opera) */
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