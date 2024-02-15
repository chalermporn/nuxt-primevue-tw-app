<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
        default: '',
    },
    label: {
        type: String,
        required: true,
        default: '',
    },
    name: {
        type: String,
        required: false,
        default: 'name',
    },
    itemList: {
        type: Array,
        required: false,
        default: [],
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Please select',
    },
    isSubmit: {
        type: Boolean,
        required: false,
        default: false,
    },
    searchable: {
        type: Boolean,
        required: false,
        default: false,
    },
    required: {
        type: Boolean,
        required: false,
        default: false,
    },
    optionLabel: {
        type: String,
        required: false,
        default: 'label',
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): any
}>()

const modelValue = computed({
    get() {
        return props.modelValue
    },
    set(e: any) {
        emit('update:modelValue', e.label)
    },
})
</script>
<template>
    <label>{{ label }}<span v-show="required" class="ml-1 text-red-500">*</span></label>
    <Dropdown id="inventoryStatus" class="!w-full" v-model="modelValue" :options="itemList" :optionLabel="optionLabel"
        :highlightOnSelect="true" :pt="{
            list: 'mt-1 text-black bg-white dark:bg-gray-700', item: ({ context }) => { }
        }" :placeholder="placeholder">
        <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">{{ slotProps.value.label }}</div>
            <div v-else-if="slotProps.value && !slotProps.value.value">{{ slotProps.value }}</div>
            <span v-else>{{ slotProps.placeholder }}</span>
        </template>
    </Dropdown>
    <small class="p-error text-red-500" v-if="required && isSubmit && !modelValue">{{ label }} is required.</small>
</template>
<style scoped></style>