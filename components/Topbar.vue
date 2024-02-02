<script setup lang="ts">
defineProps({
    menuItems: {
        default: []
    },
})
</script>
<template>
    <div class="">
        <Menubar class="px-4 border-none bg-gray-100 dark:bg-black">
            <template #start></template>
            <template #end>
                <div class="flex items-center gap-2">
                    <InputText placeholder="Search" type="text" class="w-8rem sm:w-auto" />
                    <Avatar label="V" class="mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />

                </div>
            </template>
        </Menubar>
    </div>
</template>
