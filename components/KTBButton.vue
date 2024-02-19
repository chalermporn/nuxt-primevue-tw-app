<script setup lang="ts">
const props = defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    color: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: null,
        required: false,
    },
    icon: {
        type: String,
        default: '',
        required: false,
    },
    type: {
        type: String,
        default: '' //outlined contained
    },
    size: {
        type: String,
        default: 'medium' //small medium large
    },
    borderColor: { //for outlined type
        type: String,
        default: '',
        required: false,
    },
    bgColor: { //for contained type
        type: String,
        default: '',
        required: false,
    },
    textColor: {
        type: String,
        default: '',
        required: false,
    }
})

const style: any = computed(() => {
    const { type, icon, label, textColor, borderColor, bgColor } = props
    const baseClasses = `py-2 rounded-md whitespace-nowrap ${icon && !label ? 'px-2' : 'px-4'} ${textColor}`;

    switch (type) {
        case 'outlined':
            return `${baseClasses} border border-solid ${borderColor} bg-transparent`;
        case 'contained':
            return `${baseClasses}  ${bgColor}`;
    }
})

</script>
<template>
    <Button type="button" :label="label" :icon="icon" :disabled="disabled" class="w-full h-full flex items-center"
        :pt="{ root: style }" :class="[
            'flex-1',
            { '!bg-gray-200 !text-gray-400 !border !border-gray-700': disabled },
            { 'justify-center': icon && !label },
        ]" />
</template>
<style scoped></style>