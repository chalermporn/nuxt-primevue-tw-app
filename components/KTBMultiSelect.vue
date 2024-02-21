<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Array,
        required: true,
        default: '',
    },
    options: {
        type: Array,
        required: false,
        default: [],
    },
    optionLabel: {
        type: String,
        required: true,
        default: 'name',
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Select Columns',
    },
    showTotalSelected: {
        type: Boolean,
        required: false,
        default: true,
    },
    searchable: {
        type: Boolean,
        required: false,
        default: true,
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): any
}>()

const selectedColumns = computed(() => props.modelValue)

const onToggle = (value: any) => {
    emit('update:modelValue', props.options.filter(col => value.includes(col)))

}

</script>
<template>
    <MultiSelect :modelValue="selectedColumns" :options="options" :optionLabel="optionLabel" :placeholder="placeholder"
        @update:modelValue="onToggle" display="chip" :filter="searchable" :pt="{
            label: 'flex gap-2',
            token: 'bg-gray-100 px-2 my-1 rounded flex items-center w-max text-black',
            list: 'py-0 list-none m-0 shadow-xl bg-white dark:bg-black',
            header: 'bg-white flex items-center justify-between py-1 px-5 m-0 border-b rounded-tl-md rounded-tr-md text-surface-700 dark:bg-gray-700 dark:text-white/80 bg-surface-100 dark:bg-surface-800 border-surface-300 dark:border-surface-700'
        }">
        <template #option="slotProps">
            <div class="flex align-items-center">
                {{ slotProps.option[optionLabel] }}
            </div>
            <slot name="option" />
        </template>
        <template #footer>
            <div v-if="showTotalSelected" class="py-1 px-5 bg-white">
                <b>{{ selectedColumns ? selectedColumns.length : 0 }}</b> item{{ (selectedColumns ?
                    selectedColumns.length : 0) > 1 ? 's' : '' }} selected.
            </div>
        </template>
    </MultiSelect>
</template>
<style scoped></style>