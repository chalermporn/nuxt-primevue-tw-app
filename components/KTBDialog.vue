<script setup lang="ts">
import KTBButton from '~/components/KTBButton.vue';

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
    }
})

const emit = defineEmits<{
    (e: 'onClickYes'): boolean
    (e: 'onClickNo'): boolean
}>()

const modelValue = computed(() => (props.modelValue))




</script>
<template>
    <Dialog v-model:visible="modelValue" :style="{ width: `${modalWidth}` }" :header="header" :modal="true"
        :pt="{ root: 'bg-white dark:bg-gray-700 rounded' }">
        <div class="flex flex-col gap-4">
            <slot />
            <slot name="footer">
                <div class="flex justify-end gap-2">
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