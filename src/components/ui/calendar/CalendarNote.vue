<template>
    <div class="calendar-note px-1.5 py-1 bg-amber-500 bg-opacity-20 border border-amber-400 rounded text-xs text-amber-100 cursor-pointer"
        :class="{ 'truncate': truncate }" :title="note" @click="$emit('click')">
        <div class="flex items-center">
            <IconsSet name="note" class="h-3 w-3 mr-1 text-amber-400 flex-shrink-0" />
            <span>{{ note }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import IconsSet from '@/components/ui/icons/IconsSet.vue';

defineProps({
    note: {
        type: String,
        required: true
    },
    truncate: {
        type: Boolean,
        default: true
    }
});

defineEmits(['click']);
</script>
