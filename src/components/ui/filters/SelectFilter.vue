<template>
    <BaseFilterWrapper :title="title">
        <template #icon>
            <slot name="icon"></slot>
        </template>

        <!-- Выбранные значения для множественного выбора -->
        <div v-if="multipleSelect && selectedValues.length > 0" class="flex flex-wrap mb-2">
            <FilterTag v-for="(value, index) in selectedValues" :key="index" :label="getOptionLabel(value)"
                @remove="removeValue(index)" />
        </div>

        <div class="relative">
            <select v-model="localValue"
                class="w-full appearance-none border border-primary-600 rounded-lg px-3 py-2.5 bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all hover:border-primary-500"
                @change="onChange">
                <option v-if="multipleSelect" value="" disabled class="bg-primary text-white">{{ t('filters.select')
                    }}
                </option>
                <option v-for="option in filteredOptions" :key="option.value === null ? 'null' : option.value"
                    :value="option.value" class="bg-primary text-white">
                    {{ option.label }}
                </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </BaseFilterWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BaseFilterWrapper from './BaseFilterWrapper.vue';
import FilterTag from './FilterTag.vue';
import { useI18n } from 'vue-i18n';

interface Option {
    value: string | number | null;
    label: string;
}

interface SelectFilterProps {
    title: string;
    options: Option[];
    modelValue: string | number | null | undefined | (string | number | null)[];
    multipleSelect?: boolean;
}

const props = withDefaults(defineProps<SelectFilterProps>(), {
    multipleSelect: false
});

// Обновленное определение emit с корректными типами
const emit = defineEmits<{
    'update:modelValue': [value: string | number | null | undefined | (string | number | null)[]];
    'change': [value: string | number | null | undefined | (string | number | null)[]];
}>();

const { t } = useI18n();
const localValue = ref<string | number | null>('');
const selectedValues = ref<(string | number | null)[]>([]);

// Инициализация выбранных значений
if (props.multipleSelect && Array.isArray(props.modelValue)) {
    selectedValues.value = [...props.modelValue];
} else if (props.multipleSelect && props.modelValue !== null && props.modelValue !== undefined) {
    selectedValues.value = [props.modelValue as string | number];
} else if (!props.multipleSelect) {
    // Если значение не определено и есть опции, используем первое значение
    if ((props.modelValue === null || props.modelValue === undefined || props.modelValue === '') && props.options.length > 0) {
        localValue.value = props.options[0].value;
        // Эмитим значение, чтобы обновить родительский компонент
        setTimeout(() => {
            emit('update:modelValue', localValue.value);
            emit('change', localValue.value);
        }, 0);
    } else {
        localValue.value = props.modelValue as string | number | null;
    }
}

// Отфильтрованные опции (исключаем уже выбранные в режиме multipleSelect)
const filteredOptions = computed(() => {
    if (props.multipleSelect) {
        return props.options.filter(option => !selectedValues.value.includes(option.value));
    }
    return props.options;
});

// Получение текстовой метки для значения
const getOptionLabel = (value: string | number | null): string => {
    const option = props.options.find(opt => opt.value === value);
    return option ? option.label : String(value);
};

// Обработка изменений
const onChange = () => {
    if (props.multipleSelect && localValue.value !== null && localValue.value !== '') {
        selectedValues.value.push(localValue.value);
        emit('update:modelValue', selectedValues.value);
        emit('change', selectedValues.value);
        // Сбрасываем выбранное значение после добавления
        localValue.value = '';
    } else if (!props.multipleSelect) {
        emit('update:modelValue', localValue.value);
        emit('change', localValue.value);
    }
};

// Удаление значения из выбранных
const removeValue = (index: number) => {
    selectedValues.value.splice(index, 1);
    emit('update:modelValue', selectedValues.value);
    emit('change', selectedValues.value);
};

// Отслеживание изменений modelValue извне
watch(() => props.modelValue, (newValue) => {
    if (props.multipleSelect && Array.isArray(newValue)) {
        selectedValues.value = [...newValue];
    } else if (props.multipleSelect && newValue !== null && newValue !== undefined) {
        selectedValues.value = [newValue as string | number];
    } else if (!props.multipleSelect) {
        // Если новое значение не определено и есть опции, используем первое значение
        if ((newValue === null || newValue === undefined || newValue === '') && props.options.length > 0) {
            localValue.value = props.options[0].value;
            // Эмитим значение, чтобы обновить родительский компонент
            emit('update:modelValue', localValue.value);
            emit('change', localValue.value);
        } else {
            localValue.value = newValue as string | number | null;
        }
    }
});

// При изменении списка опций, проверяем, нужно ли установить значение по умолчанию
watch(() => props.options, (newOptions) => {
    if (!props.multipleSelect && (localValue.value === null || localValue.value === undefined || localValue.value === '') && newOptions.length > 0) {
        localValue.value = newOptions[0].value;
        emit('update:modelValue', localValue.value);
        emit('change', localValue.value);
    }
}, { deep: true });

// При монтировании компонента
onMounted(() => {
    // Если значение не выбрано (null/undefined) и есть опции, выбираем первую опцию
    if (!props.multipleSelect && (localValue.value === null || localValue.value === undefined || localValue.value === '') && props.options.length > 0) {
        localValue.value = props.options[0].value;
        emit('update:modelValue', localValue.value);
        emit('change', localValue.value);
    }
});
</script>
