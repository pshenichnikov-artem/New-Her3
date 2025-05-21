<template>
    <BaseFilterWrapper :title="title">
        <template #icon>
            <slot name="icon"></slot>
        </template>

        <!-- Выбранные значения -->
        <div v-if="multipleSelect && selectedValues.length > 0" class="flex flex-wrap mb-2">
            <FilterTag v-for="(value, index) in selectedValues" :key="index" :label="formatNumber(value)"
                @remove="removeValue(index)" />
        </div>

        <div class="relative">
            <input type="text" inputmode="numeric" pattern="[0-9]*" v-model="inputValue" :placeholder="placeholder"
                class="w-full border border-primary-600 rounded-lg px-3 py-2.5 bg-primary text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all hover:border-primary-500"
                @input="onInput" @focus="showSuggestions = true" @keydown.enter="onEnterKey" @blur="onBlur" />

            <!-- Значок валюты, если необходимо -->
            <div v-if="currency"
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                {{ currency }}
            </div>

            <!-- Выпадающий список с предложениями -->
            <div v-if="multipleSelect && showSuggestions && filteredSuggestions.length > 0"
                class="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-primary border border-primary-600 rounded-lg shadow-lg z-10">
                <div v-for="(suggestion, index) in filteredSuggestions" :key="index"
                    class="px-4 py-2 hover:bg-primary-600 cursor-pointer text-white"
                    :class="{ 'bg-primary-600 text-text-accent': index === activeSuggestionIndex }"
                    @mousedown="selectSuggestion(suggestion)" @mouseover="activeSuggestionIndex = index">
                    {{ formatNumber(suggestion) }}
                </div>
            </div>
        </div>
    </BaseFilterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseFilterWrapper from './BaseFilterWrapper.vue';
import FilterTag from './FilterTag.vue';

interface NumberFilterProps {
    title: string;
    placeholder?: string;
    modelValue: number | number[] | null | undefined;
    multipleSelect?: boolean;
    currency?: string;
    getSuggestions?: (input: string) => Promise<number[]> | number[];
}

const props = withDefaults(defineProps<NumberFilterProps>(), {
    placeholder: '',
    multipleSelect: false,
    currency: '',
});

const emit = defineEmits<{
    'update:modelValue': [value: number | number[] | null | undefined];
}>();

const inputValue = ref('');
const showSuggestions = ref(false);
const suggestions = ref<number[]>([]);
const activeSuggestionIndex = ref(-1);
const selectedValues = ref<number[]>([]);

// Инициализация выбранных значений
if (props.multipleSelect && Array.isArray(props.modelValue)) {
    selectedValues.value = [...props.modelValue];
} else if (props.multipleSelect && props.modelValue !== null) {
    selectedValues.value = [props.modelValue as number];
} else if (!props.multipleSelect && props.modelValue !== null) {
    inputValue.value = String(props.modelValue);
}

const filteredSuggestions = computed(() => {
    return suggestions.value.filter(
        suggestion => !selectedValues.value.includes(suggestion) &&
            String(suggestion).includes(inputValue.value)
    );
});

const formatNumber = (value: number): string => {
    return props.currency ? `${value} ${props.currency}` : String(value);
};

const onInput = async () => {
    // Разрешаем только цифры, запятую, точку и пробелы
    inputValue.value = inputValue.value.replace(/[^0-9.,\s]/g, '');

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
        const numberValue = parseFloat(inputValue.value.replace(/,/g, '.'));
        emit('update:modelValue', isNaN(numberValue) ? null : numberValue);
    }
};

const selectSuggestion = (suggestion: number) => {
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
        const numberValue = parseFloat(inputValue.value.replace(/,/g, '.'));
        if (!isNaN(numberValue) && !selectedValues.value.includes(numberValue)) {
            selectedValues.value.push(numberValue);
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
        const numberValue = parseFloat(inputValue.value.replace(/,/g, '.'));
        emit('update:modelValue', isNaN(numberValue) ? null : numberValue);
    }
};

watch(() => props.modelValue, (newValue) => {
    if (props.multipleSelect && Array.isArray(newValue)) {
        selectedValues.value = [...newValue];
    } else if (props.multipleSelect && newValue !== null && newValue !== undefined) {
        selectedValues.value = [newValue as number];
    } else if (!props.multipleSelect && newValue !== null && newValue !== undefined) {
        inputValue.value = String(newValue);
    } else {
        inputValue.value = '';
    }
});
</script>
