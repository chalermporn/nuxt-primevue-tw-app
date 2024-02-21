<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
        default: '',
    },
    rows: {
        type: Array,
        required: false,
        default: '',
    },
    totalRecords: {
        type: [String, Number],
        required: true,
        default: '',
    },
    template: {
        type: String,
        required: true,
        default: '', //FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink
    },
    currentPageReportTemplate: {
        type: String,
        required: true,
        default: '',
    },
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): any
    (e: 'onPageChange', value: any): any
}>()

const onPageChange = (e: any) => {
    emit('onPageChange', e)
}

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
    <Paginator v-model:first="modelValue" :rows="rows" :totalRecords="totalRecords" :template="template"
        :currentPageReportTemplate="currentPageReportTemplate" @page="onPageChange($event)">
        <template #start>
            <slot name="start" />
        </template>
        <template #end>
            <slot name="end" />
        </template>
    </Paginator>
</template>