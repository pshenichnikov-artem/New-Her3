<template>
    <BaseEditor :title="isEditMode ? t('event.edit') : t('event.create')" :back-path="'/dashboard/events'"
        :is-loading="eventApi.isLoading" :has-changes="hasChanges" @back="goBack" @cancel="resetForm"
        @save="form.handleSubmit(saveEvent)">

        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin text-4xl text-primary-600">
                <i class="fas fa-spinner"></i>
            </div>
        </div>
        <div v-else-if="eventForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Основная информация -->
                <div class="space-y-4">
                    <ValidationInput id="title" v-model="eventForm.title" :label="t('event.fields.title')"
                        validation-rules="required|minLength:3" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required'),
                            minLength: t('validation.minLength', { min: 3 })
                        }" :trigger-validation="form.validationTrigger.title"
                        @valid="form.updateValidationState('title', $event)" />

                    <div class="form-group">
                        <label for="description" class="block mb-1 font-medium text-sm text-text-form">
                            {{ t('event.fields.description') }}
                        </label>
                        <textarea id="description" v-model="eventForm.description"
                            class="w-full px-3 py-2 border rounded-lg bg-form-light h-32"
                            :readonly="isReadOnly"></textarea>
                    </div>

                    <ValidationInput id="location" v-model="eventForm.location" :label="t('event.fields.location')"
                        validation-rules="required" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required')
                        }" :trigger-validation="form.validationTrigger.location"
                        @valid="form.updateValidationState('location', $event)" />

                    <ValidationInput id="tag" v-model="eventForm.tag" :label="t('event.fields.tag')"
                        validation-rules="required" :readonly="isReadOnly" :error-messages="{
                            required: t('validation.required')
                        }" :trigger-validation="form.validationTrigger.tag"
                        @valid="form.updateValidationState('tag', $event)" />
                </div>

                <!-- Дополнительная информация -->
                <div class="space-y-4">
                    <ValidationInput id="startDate" v-model="eventForm.startDate" type="datetime-local"
                        :label="t('event.fields.startDate')" validation-rules="required" :readonly="isReadOnly"
                        :error-messages="{
                            required: t('validation.required'),
                            date: t('validation.date')
                        }" :trigger-validation="form.validationTrigger.startDate"
                        @valid="form.updateValidationState('startDate', $event)" />

                    <ValidationInput id="endDate" v-model="eventForm.endDate" type="datetime-local"
                        :label="t('event.fields.endDate')" validation-rules="date" :readonly="isReadOnly"
                        :trigger-validation="form.validationTrigger.endDate" @valid="validateEventDates" />

                    <ValidationInput id="ticketCount" v-model.number="eventForm.ticketCount" type="number"
                        :label="t('event.fields.ticketsCount')" validation-rules="required|min:0" :readonly="isReadOnly"
                        :error-messages="{
                            required: t('validation.required'),
                            min: t('validation.positive')
                        }" :trigger-validation="form.validationTrigger.ticketCount"
                        @valid="form.updateValidationState('ticketCount', $event)" />

                    <ValidationInput id="price" v-model.number="eventForm.price" type="number"
                        :label="t('event.fields.price')" validation-rules="required|min:0" :readonly="isReadOnly"
                        :error-messages="{
                            required: t('validation.required'),
                            min: t('validation.positive')
                        }" :trigger-validation="form.validationTrigger.price"
                        @valid="form.updateValidationState('price', $event)" />

                    <div class="form-group">
                        <div class="flex items-center">
                            <input id="isActive" type="checkbox" v-model="eventForm.isActive"
                                class="h-4 w-4 border-gray-300 rounded mr-2" :disabled="isReadOnly">
                            <label for="isActive" class="font-medium text-sm text-text-form">
                                {{ t('event.fields.isActive') }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Секция для изображений -->
            <div class="mt-6 border-t border-primary-700 pt-4">
                <h3 class="text-lg font-medium mb-4">{{ t('event.fields.images') }}</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div v-for="(image, index) in eventForm.images" :key="index"
                        class="relative border rounded-lg overflow-hidden">
                        <!-- Отображение изображения -->
                        <img v-if="getImageUrl(image)" :src="getImageUrl(image)" class="w-full h-32 object-cover"
                            :alt="`Image ${index + 1}`" />
                        <div v-else class="w-full h-32 bg-primary-700 flex items-center justify-center">
                            <i class="fas fa-image text-primary-300 text-3xl"></i>
                        </div>

                        <button v-if="!isReadOnly" @click="removeImage(index)" type="button"
                            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            :title="t('common.buttons.delete')">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>

                    <!-- Кнопка добавления изображения -->
                    <div v-if="!isReadOnly" @click="triggerImageUpload"
                        class="border-2 border-dashed border-primary-600 rounded-lg flex items-center justify-center h-32 cursor-pointer hover:bg-primary-800">
                        <div class="text-center">
                            <i class="fas fa-plus text-primary-500 text-2xl mb-1"></i>
                            <p class="text-sm text-primary-500">{{ t('event.addImage') }}</p>
                        </div>
                    </div>

                    <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload"
                        multiple>
                </div>
            </div>
        </div>
    </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useEventApi } from '@/composables/api/useEventApi';
import type { EventUpdateRequest } from '@/types/event/EventUpdateRequest';
import type { EventAddRequest } from '@/types/event/EventAddRequest';
import type { ImageAddRequest } from '@/types/image/ImageAddRequest';
import type { EventImageUpdateRequest } from '@/types/event/EventImageUpdateRequest';
import type { ImageResponse } from '@/types/image/ImageResponse';
import type { ImageUpdateRequest } from '@/types/image/ImageUpdateRequest';
import BaseEditor from '@/components/editors/BaseEditor.vue';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import { useNotification } from '@/composables/useNotification';
import { useFormValidation } from '@/composables/useFormValidation';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const eventApi = useEventApi();
const notification = useNotification();

const eventId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === 'dashboard-events-edit');
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialEventData = ref<EventUpdateRequest | EventAddRequest | null>(null);

// Создаем форму с правильными типами данных
const eventForm = ref<EventUpdateRequest>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    ticketCount: 0,
    images: [],
    price: 0,
    isActive: true,
    tag: ''
});

// Настраиваем валидацию формы
const form = useFormValidation([
    'title', 'location', 'startDate', 'endDate', 'ticketCount', 'tag', 'price'
]);

const imageInput = ref<HTMLInputElement | null>(null);

const hasChanges = computed(() => {
    if (!eventForm.value || !initialEventData.value) return false;

    // Сравниваем основные поля без изображений
    const currentWithoutImages = { ...eventForm.value };
    delete (currentWithoutImages as any).images;

    const initialWithoutImages = { ...initialEventData.value };
    delete (initialWithoutImages as any).images;

    return JSON.stringify(currentWithoutImages) !== JSON.stringify(initialWithoutImages) ||
        eventForm.value.images.length !== (initialEventData.value.images?.length || 0);
});


// Функция для получения URL изображения
const getImageUrl = (image: EventImageUpdateRequest): string => {
    // Проверяем, существующее ли это изображение (с id)
    if (image.id) {
        return (image as any).url || '';
    }

    // Если это новое изображение с файлом
    if (image.image) {
        return URL.createObjectURL(image.image);
    }

    return '';
};

onMounted(async () => {
    isLoading.value = true;

    if (isEditMode.value) {
        await eventApi.getEventById(eventId.value, {
            onSuccess: (event) => {
                if (event) {
                    // Преобразуем изображения из ответа API в формат для формы
                    const formImages: EventImageUpdateRequest[] = event.images.map((img: ImageResponse, index: number) => ({
                        id: img.id,
                        url: img.url,
                        imageType: img.imageType || 'image/jpeg',
                        localOrderRank: index,
                        entityId: event.id,
                        entityTarget: 'Event'
                    } as any));

                    initialEventData.value = {
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        startDate: formatDateTimeForInput(event.startTime),
                        endDate: formatDateTimeForInput(event.endTime),
                        ticketCount: event.ticketsCount || 0,
                        images: formImages,
                        price: event.price,
                        isActive: event.isActive,
                        tag: event.tag || ''
                    };
                    eventForm.value = { ...initialEventData.value };
                } else {
                    notification.error(t('errors.eventNotFound'));
                    goBack();
                }
            },
            onError: () => {
                notification.error(t('errors.loadingFailed'));
                goBack();
            }
        });
    } else {
        eventForm.value = {
            title: '',
            description: '',
            location: '',
            startDate: '',
            endDate: '',
            ticketCount: 0,
            images: [],
            price: 0,
            isActive: true,
            tag: ''
        };
        initialEventData.value = { ...eventForm.value };
    }

    isLoading.value = false;
});

// Функция для валидации дат мероприятия
const validateEventDates = (isValid: boolean) => {
    if (!isValid || !eventForm.value.endDate) {
        return form.updateValidationState('endDate', true); // Необязательное поле
    }

    const startDate = new Date(eventForm.value.startDate);
    const endDate = new Date(eventForm.value.endDate);

    if (endDate < startDate) {
        form.updateValidationState('endDate', false);

        if (form.validationTrigger.endDate !== undefined) {
            form.validationTrigger.endDate += 1;
        }
        return;
    }

    form.updateValidationState('endDate', true);
};

// Форматирование даты/времени для полей input type="datetime-local"
const formatDateTimeForInput = (dateTimeString: string): string => {
    if (!dateTimeString) return '';

    try {
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 16); // Формат "YYYY-MM-DDThh:mm"
    } catch (error) {
        console.error('Error formatting date for input:', error);
        return '';
    }
};

// Функции для работы с изображениями
const triggerImageUpload = () => {
    if (imageInput.value) {
        imageInput.value.click();
    }
};

const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
            // Создаем объект изображения для добавления в форму (новое изображение без id)
            const newImage: EventImageUpdateRequest = {
                id: '', // Пустой id означает новое изображение
                image: file,
                imageType: file.type,
                localOrderRank: eventForm.value.images.length + i,
                entityTarget: 'Event'
            };

            // Добавление изображения в массив
            eventForm.value.images.push(newImage);
        } catch (error) {
            notification.error(t('errors.imageUploadFailed'));
            console.error('Error uploading image:', error);
        }
    }

    // Сброс поля ввода для возможности повторной загрузки того же файла
    if (imageInput.value) {
        imageInput.value.value = '';
    }
};

const removeImage = (index: number) => {
    eventForm.value.images.splice(index, 1);

    // Пересчитываем порядковые номера после удаления
    eventForm.value.images.forEach((img, idx) => {
        img.localOrderRank = idx;
    });
};

const goBack = () => {
    router.push('/dashboard/events');
};

const resetForm = () => {
    if (initialEventData.value) {
        eventForm.value = { ...initialEventData.value } as typeof eventForm.value;
    }
    form.resetValidation();
    notification.info(t('common.changesDiscarded'));
};

const saveEvent = async () => {
    // Проверка валидности дат перед сохранением
    if (eventForm.value.endDate) {
        validateEventDates(true);
    }

    if (isEditMode.value) {
        const updateData: EventUpdateRequest = {
            title: eventForm.value.title,
            description: eventForm.value.description,
            location: eventForm.value.location,
            startDate: eventForm.value.startDate,
            endDate: eventForm.value.endDate || eventForm.value.startDate,
            ticketCount: eventForm.value.ticketCount,
            images: eventForm.value.images,
            price: eventForm.value.price,
            isActive: eventForm.value.isActive,
            tag: eventForm.value.tag
        };

        await eventApi.updateEvent(eventId.value, updateData, {
            onSuccess: () => {
                initialEventData.value = { ...updateData };
                notification.success(t('event.updateSuccess'));
            },
            onError: () => {
                notification.error(t('event.updateFailed'));
            }
        });
    } else {
        // Подготовка данных для создания
        // Преобразуем изображения в нужный формат для запроса создания
        const addImages: ImageAddRequest[] = eventForm.value.images
            .filter(img => !img.id) // Фильтруем только новые изображения (без id)
            .map(img => ({
                image: img.image!,
                imageType: img.imageType,
                localOrderRank: img.localOrderRank,
                entityTarget: img.entityTarget
            }));

        const addData: EventAddRequest = {
            title: eventForm.value.title,
            description: eventForm.value.description,
            location: eventForm.value.location,
            startDate: eventForm.value.startDate,
            endDate: eventForm.value.endDate || eventForm.value.startDate,
            ticketCount: eventForm.value.ticketCount,
            images: addImages,
            tag: eventForm.value.tag
        };

        await eventApi.createEvent(addData, {
            onSuccess: () => {
                notification.success(t('event.createSuccess'));
                router.push('/dashboard/events');
            },
            onError: () => {
                notification.error(t('event.createFailed'));
            }
        });
    }
};
</script>
