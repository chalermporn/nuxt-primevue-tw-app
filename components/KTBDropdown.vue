<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true,
        default: '',
    },
    label: {
        type: String,
        required: false,
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
    required: {
        type: Boolean,
        required: false,
        default: false,
    },
    validate: {
        type: Object,
        required: false,
        default: false,
    },
    searchable: {
        type: Boolean,
        required: false,
        default: false,
    },
    optionLabel: {
        type: String,
        required: false,
        default: 'label',
    },
    optionValue: {
        type: String,
        required: false,
        default: 'value',
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): any
}>()

const selectedLabel = computed(() => {
    const findList = props.itemList.find((item: any) => item.value === modelValue.value) as any
    return findList?.label
})

const modelValue = computed({
    get() {
        return props.modelValue
    },
    set(e: any) {
        emit('update:modelValue', e.value)
    },
})

const invalid = computed(() => (props.validate.$invalid && props.isSubmit))
</script>
<template>
    <div>
        <label>{{ label }}<span v-show="required" class="ml-1 text-red-500">*</span></label>
        <Dropdown class="!w-full" v-model="modelValue" :options="itemList" :optionLabel="optionLabel" :pt="{
            list: 'mt-1 text-black bg-white dark:bg-gray-700',
            root: invalid ? 'border border-red-500' : ''
        }" :ptOptions="{ mergeSections: true, mergeProps: true }" :placeholder="placeholder">
            <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">{{ slotProps.value.label }}</div>
                <div v-else-if="slotProps.value && !slotProps.value.value">{{ selectedLabel }} </div>
                <span v-else>{{ slotProps.placeholder }}</span>
            </template>
        </Dropdown>
        <small class="p-error text-red-500" v-if="invalid">{{ validate.required.$message
        }}</small>
    </div>
</template>
<style scoped></style>