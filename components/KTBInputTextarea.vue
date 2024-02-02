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

</script>
<template>
    <div>
        <label>{{ label }}</label>
        <Textarea class="w-full" :value="modelValue" :name="name" :placeholder="placeholder" :required="required"
            :rows="rows" :cols="cols" @input="(e) => (emit('update:modelValue', e.target.value))" />
        <small class="p-error text-red-500" v-if="isSubmit && required && !modelValue">{{ label }} is required.</small>
    </div>
</template>
<style scoped></style>