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
        <InputText class="w-full bg-white dark:bg-transparent" :value="modelValue" :name="name" :placeholder="placeholder"
            @input="(e) => (emit('update:modelValue', e.target.value))" />
        <small class="p-error text-red-500" v-if="isSubmit && required && !modelValue">{{ label }} is required.</small>
    </div>
</template>
<style scoped></style>