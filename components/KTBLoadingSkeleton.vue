<script setup>
defineProps({
    width: {
        type: String,
        required: false,
        default: '80px',
    },
    height: {
        type: String,
        required: false,
        default: '16px',
    },
    borderRadius: {
        type: String,
        required: false,
        default: '16px',
    },
    shape: {
        type: String,
        required: false,
        default: '', //circle square
    },
})
</script>
<template>
    <Skeleton class="bg-gray-200" :width="width" :height="height" :borderRadius="borderRadius"></Skeleton>
</template>