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
    validate: {
        type: Object,
        required: false,
        default: false,
    },
    rows: {
        type: Number,
        required: false,
        default: 5,
    },
    cols: {
        type: Number,
        required: false,
        default: 20,
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): any
}>()

const modelValue = computed(() => (props.modelValue))
const invalid = computed(() => (props.validate.$invalid && props.isSubmit))

</script>
<template>
    <div>
        <label>{{ label }}<span v-show="required" class="ml-1 text-red-500">*</span></label>
        <Textarea class="w-full bg-white dark:bg-transparent" :value="modelValue" :name="name" :placeholder="placeholder"
            :required="required" :rows="rows" :cols="cols" @input="(e) => (emit('update:modelValue', e.target.value))"
            :pt="{ root: invalid ? 'border border-red-500' : '' }" :ptOptions="{ mergeSections: true, mergeProps: true }" />
        <small class="p-error text-red-500" v-if="invalid">{{ validate.required.$message }}</small>
    </div>
</template>
<style scoped></style>