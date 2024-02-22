<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: '',
    },
    header: {
        type: String,
        required: false,
        default: 'Confirm',
    },
    modalWidth: {
        type: String,
        required: false,
        default: '450px',
    },
    btnNoLabel: {
        type: String,
        required: false,
        default: 'No',
    },
    btnYesLabel: {
        type: String,
        required: false,
        default: 'Yes',
    },
    modal: {
        type: Boolean,
        required: false,
        default: true,
    }
})

const emit = defineEmits<{
    (e: 'onClickYes'): boolean
    (e: 'onClickNo'): boolean
    (e: 'update:modelValue', value: any): any
}>()

const modelValue = computed({
    get() {
        return props.modelValue
    },
    set(value: any) {
        emit('update:modelValue', value)
    },
})

const { isMaxSm } = inject('screen') as any

</script>
<template>
    <Dialog class="rounded-t-lg" v-model:visible="modelValue" :style="{ width: `${modalWidth}` }" :header="header"
        :modal="modal" :pt="{
            root: [
                'bg-white dark:bg-gray-700 rounded-lg',
                isMaxSm ? '!w-full max-h-[70%] rounded-t-lg rounded-b-none' : 'rounded-lg'
            ],
            mask: 'p-0 transition duration-200 bg-black/40 backdrop-blur-sm'
        }" :position="isMaxSm ? 'bottom' : ''">
        <div class="flex flex-col gap-4">
            <slot />
            <slot name="footer">
                <div class="pt-4 flex justify-end gap-4">
                    <KTBButton :label="btnNoLabel" icon="pi pi-times" type="outlined" border-color="border-red-700"
                        text-color="text-red-700 dark:text-white" @click="emit('onClickNo')" />
                    <KTBButton :label="btnYesLabel" icon="pi pi-check" type="contained" bg-color="bg-green-700"
                        text-color="text-white" @click="emit('onClickYes')" />
                </div>
            </slot>
        </div>
    </Dialog>
</template>
<style scoped></style>