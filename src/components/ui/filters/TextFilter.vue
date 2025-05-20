<template>
    <BaseFilterWrapper :title="title">
        <template #icon>
            <slot name="icon"></slot>
        </template>

        <!-- Выбранные значения -->
        <div v-if="multipleSelect && selectedValues.length > 0" class="flex flex-wrap mb-2">
            <FilterTag v-for="(value, index) in selectedValues" :key="index" :label="value"
                @remove="removeValue(index)" />
        </div>

        <div class="relative">
            <input type="text" v-model="inputValue" :placeholder="placeholder"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition-all hover:bg-white hover:border-indigo-300"
                @input="onInput" @focus="showSuggestions = true" @keydown.enter="onEnterKey" @blur="onBlur" />

            <!-- Выпадающий список с предложениями -->
            <div v-if="multipleSelect && showSuggestions && filteredSuggestions.length > 0"
                class="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div v-for="(suggestion, index) in filteredSuggestions" :key="index"
                    class="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700"
                    :class="{ 'bg-indigo-50 text-indigo-700': index === activeSuggestionIndex }"
                    @mousedown="selectSuggestion(suggestion)" @mouseover="activeSuggestionIndex = index">
                    {{ suggestion }}
                </div>
            </div>
        </div>
    </BaseFilterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseFilterWrapper from './BaseFilterWrapper.vue';
import FilterTag from './FilterTag.vue';

interface TextFilterProps {
    title: string;
    placeholder?: string;
    modelValue: string | string[];
    multipleSelect?: boolean;
    getSuggestions?: (input: string) => Promise<string[]> | string[];
}

const props = withDefaults(defineProps<TextFilterProps>(), {
    placeholder: '',
    multipleSelect: false,
});

const emit = defineEmits<{
    'update:modelValue': [value: string | string[]];
}>();

const inputValue = ref('');
const showSuggestions = ref(false);
const suggestions = ref<string[]>([]);
const activeSuggestionIndex = ref(-1);
const selectedValues = ref<string[]>([]);

// Инициализация выбранных значений
if (props.multipleSelect && Array.isArray(props.modelValue)) {
    selectedValues.value = [...props.modelValue];
} else if (props.multipleSelect) {
    selectedValues.value = props.modelValue ? [props.modelValue as string] : [];
} else if (!props.multipleSelect && props.modelValue) {
    inputValue.value = props.modelValue as string;
}

const filteredSuggestions = computed(() => {
    return suggestions.value.filter(
        suggestion => !selectedValues.value.includes(suggestion) &&
            suggestion.toLowerCase().includes(inputValue.value.toLowerCase())
    );
});

const onInput = async () => {
    if (props.multipleSelect && props.getSuggestions) {
        try {
            const result = await props.getSuggestions(inputValue.value);
            suggestions.value = result;
            showSuggestions.value = true;
            activeSuggestionIndex.value = -1;
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestions.value = [];
        }
    } else {
        emit('update:modelValue', inputValue.value);
    }
};

const selectSuggestion = (suggestion: string) => {
    if (props.multipleSelect) {
        if (!selectedValues.value.includes(suggestion)) {
            selectedValues.value.push(suggestion);
            emit('update:modelValue', selectedValues.value);
        }
        inputValue.value = '';
        showSuggestions.value = false;
    }
};

const removeValue = (index: number) => {
    selectedValues.value.splice(index, 1);
    emit('update:modelValue', selectedValues.value);
};

const onEnterKey = (e: KeyboardEvent) => {
    if (props.multipleSelect && showSuggestions.value && activeSuggestionIndex.value >= 0) {
        selectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value]);
        e.preventDefault();
    } else if (props.multipleSelect && inputValue.value.trim()) {
        if (!selectedValues.value.includes(inputValue.value)) {
            selectedValues.value.push(inputValue.value);
            emit('update:modelValue', selectedValues.value);
        }
        inputValue.value = '';
        e.preventDefault();
    }
};

const onBlur = () => {
    // Задержка, чтобы успеть обработать клик по предложению
    setTimeout(() => {
        showSuggestions.value = false;
    }, 200);

    if (!props.multipleSelect) {
        emit('update:modelValue', inputValue.value);
    }
};

watch(() => props.modelValue, (newValue) => {
    if (props.multipleSelect && Array.isArray(newValue)) {
        selectedValues.value = [...newValue];
    } else if (props.multipleSelect && newValue) {
        selectedValues.value = [newValue as string];
    } else if (!props.multipleSelect) {
        inputValue.value = newValue as string;
    }
});
</script>
