<script setup lang="ts">
defineProps({
    label: {
        type: String,
        required: true,
        default: '',
    },
    required: {
        type: Boolean,
        required: false,
    },
    showErrMsg: {
        type: Boolean,
        required: false,
    },
})
</script>
<template>
    <div>
        <label>{{ label }}<span v-show="required" class="ml-1 text-red-500">*</span></label>
        <slot />
        <small class="p-error text-red-500" v-if="showErrMsg">{{ label }} is required.</small>
    </div>
</template>