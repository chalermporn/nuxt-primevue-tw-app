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
    <MultiSelect class="w-full md:w-[20rem]" :modelValue="selectedColumns" :options="options" :optionLabel="optionLabel"
        :placeholder="placeholder" :pt="{
            header: 'bg-white dark:bg-gray-700',
            list: 'bg-white dark:bg-gray-700 !py-0',
            filterinput: '!text-black',
            token: 'bg-gray-100 dark:!text-black',
        }" :ptOptions="{ mergeSections: true, mergeProps: true }" @update:modelValue="onToggle" display="chip"
        :filter="searchable">
        <template #option="slotProps">
            <div class="flex align-items-center">
                {{ slotProps.option[optionLabel] }}
            </div>
            <slot name="option" />
        </template>
        <template #footer>
            <div v-if="showTotalSelected" class="py-1 px-5 bg-white dark:bg-gray-700">
                <b>{{ selectedColumns ? selectedColumns.length : 0 }}</b> item{{ (selectedColumns ?
                    selectedColumns.length : 0) > 1 ? 's' : '' }} selected.
            </div>
        </template>
    </MultiSelect>
</template>
<style scoped></style>