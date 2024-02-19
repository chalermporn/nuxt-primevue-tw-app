<script setup lang="ts">
defineProps({
    menuItems: {
        default: []
    },
})

const emit = defineEmits<{
    (e: 'toggle-sidebar'): any
}>()
const { isMaxMd } = inject('screen') as any

</script>
<template>
    <header>
        <Menubar class="p-4 border-none bg-gray-100 dark:bg-black">
            <template #start>
                <div v-if="isMaxMd" class="w-12 flex justify-center">
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
