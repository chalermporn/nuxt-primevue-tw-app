<script setup lang="ts">
defineProps({
    menuItems: {
        default: []
    },
})

const emit = defineEmits<{
    (e: 'toggle-sidebar'): any
}>()

</script>
<template>
    <header>
        <Menubar class="px-4 border-none bg-gray-100 dark:bg-black">
            <template #start>
                <div class="w-12 flex justify-center max-md:block md:hidden">
                    <i class="pi pi-bars" @click="emit('toggle-sidebar')" />
                </div>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <Avatar label="V" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                </div>
            </template>
        </Menubar>
    </header>
</template>
