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
    placeholder: {
        type: String,
        required: false,
        default: '',
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
    decimal: {
        type: Number,
        required: false,
        default: 0,
    },

})

const emit = defineEmits<{
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
</script>
<template>
    <div>
        <label>{{ label }}</label>
        <InputNumber class="w-full text-black" v-model="modelValue" :maxFractionDigits="decimal"
            @input="(e) => (modelValue = e.value)"
            :pt="{ input: { root: 'bg-white text-dark w-full dark:bg-transparent dark:text-white' } }"
            :ptOptions="{ mergeSections: true, mergeProps: true }" />
        <small class="p-error text-red-500" v-if="isSubmit && required && !modelValue">{{ label }} is required.</small>
    </div>
</template>
<style scoped></style>