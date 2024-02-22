<script setup lang="ts">
const props = defineProps({
    first: {
        type: [String, Number],
        required: true,
        default: '',
    },
    rows: {
        type: Number,
        required: false,
        default: '',
    },
    totalRecords: {
        type: Number,
        required: false,
        default: '',
    },
    template: {
        type: String,
        required: false,
        default: '', //FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink
    },
    currentPageReportTemplate: {
        type: String,
        required: false,
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
        return props.first
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