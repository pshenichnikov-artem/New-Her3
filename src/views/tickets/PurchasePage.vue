<template>
    <div class="min-h-screen flex flex-col">
        <MainNavbar />
        <div class="flex-grow bg-content py-8 px-4 md:px-8">
            <div class="max-w-4xl mx-auto">
                <!-- Заголовок страницы -->
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-text-accent">{{ t('tickets.purchase.title') }}</h1>
                    <p class="text-text-muted mt-2">{{ t('tickets.purchase.description') }}</p>
                </div>

                <!-- Карточка мероприятия (если есть) -->
                <div v-if="event" class="bg-primary-800 rounded-lg p-5 mb-8 border border-primary-600 shadow-lg">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="md:w-1/4">
                            <img v-if="event.images && event.images.length > 0" :src="event.images[0].url"
                                :alt="event.title" class="w-full h-40 object-cover rounded-lg" />
                            <div v-else class="w-full h-40 bg-primary-700 flex items-center justify-center rounded-lg">
                                <IconsSet name="image" class="h-16 w-16 text-primary-300" />
                            </div>
                        </div>
                        <div class="md:w-3/4">
                            <h2 class="text-xl font-bold text-text-accent mb-2">{{ event.title }}</h2>
                            <!-- Показываем дату и время -->
                            <div class="flex items-center text-sm text-text-muted mb-2">
                                <IconsSet name="calendar" class="h-5 w-5 mr-2 text-primary-300" />
                                <span>{{ formatDateTime(new Date(event.startTime)) }}</span>
                            </div>
                            <!-- Длительность мероприятия -->
                            <div class="flex items-center text-sm text-text-muted mb-2">
                                <IconsSet name="clock" class="h-5 w-5 mr-2 text-primary-300" />
                                <span>{{ formatDuration }}</span>
                            </div>
                            <div class="flex items-center text-sm text-text-muted mb-4">
                                <IconsSet name="location" class="h-5 w-5 mr-2 text-primary-300" />
                                <span>{{ event.location }}</span>
                            </div>
                            <div class="text-lg font-bold text-primary-200">
                                {{ t('tickets.price') }}: {{ formatPrice(event.price) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Загрузка -->
                <div v-if="isLoading" class="flex justify-center items-center py-12">
                    <div class="spinner"></div>
                </div>
                <!-- Ошибка -->
                <div v-else-if="error"
                    class="bg-notification-error bg-opacity-10 p-6 rounded-lg border border-notification-error-border text-notification-error-text mb-6">
                    <h3 class="font-bold text-lg mb-2">{{ t('common.errors.error') }}</h3>
                    <p>{{ error }}</p>
                    <button @click="goBack"
                        class="mt-4 px-4 py-2 bg-notification-error text-white rounded-lg hover:bg-opacity-90">
                        {{ t('common.buttons.goBack') }}
                    </button>
                </div>
                <!-- Форма билетов -->
                <div v-else>
                    <form @submit.prevent="submitForm">
                        <!-- Управление количеством билетов -->
                        <div class="bg-primary-800 rounded-lg p-5 mb-6 border border-primary-600">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-bold text-text-accent">{{ t('tickets.purchase.ticketsCount',
                                        { count: attendees.length }) }}</h3>
                                    <p class="text-text-muted text-sm">{{ t('tickets.purchase.maxTickets', {
                                        max:
                                            MAX_TICKETS
                                    }) }}</p>
                                </div>
                                <div class="flex items-center">
                                    <button type="button" @click="removeAttendee" :disabled="attendees.length <= 1"
                                        class="px-3 py-1.5 rounded-lg border border-primary-500 text-text-accent mr-2"
                                        :class="attendees.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'">
                                        <IconsSet name="minus" class="h-5 w-5" />
                                    </button>
                                    <span class="mx-2 text-text-accent font-bold">{{ attendees.length }}</span>
                                    <button type="button" @click="addAttendee"
                                        :disabled="attendees.length >= MAX_TICKETS"
                                        class="px-3 py-1.5 rounded-lg border border-primary-500 text-text-accent"
                                        :class="attendees.length >= MAX_TICKETS ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'">
                                        <IconsSet name="plus" class="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Билеты (формы для каждого посетителя) -->
                        <div v-for="(attendee, index) in attendees" :key="index"
                            class="bg-primary-800 rounded-lg p-5 mb-6 border border-primary-600">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-bold text-text-accent">{{ t('tickets.purchase.ticket') }} #{{
                                    index + 1 }}</h3>
                                <button v-if="index > 0" type="button" @click="() => removeSpecificAttendee(index)"
                                    class="text-red-400 hover:text-red-300 focus:outline-none">
                                    <IconsSet name="trash" class="h-5 w-5" />
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- ФИО -->
                                <ValidationInput :id="`fullName-${index}`" :label="t('fields.fullName')" type="text"
                                    v-model="attendee.fullName" validationRules="required|fullName" :error-messages="{
                                        required: t('validation.fullName.required'),
                                        fullName: t('validation.fullName.pattern')
                                    }" @valid="(isValid) => form.updateValidationState(`fullName-${index}`, isValid)"
                                    :triggerValidation="form.validationTrigger[`fullName-${index}`]" />

                                <!-- Дата рождения с DateValidation и ограничением по возрасту -->
                                <DateValidation :id="`birthDate-${index}`" :label="t('fields.birthDate')"
                                    placeholder="Выберите дату рождения" v-model="attendee.birthDate"
                                    :maxDate="maxBirthDate" :minDate="minBirthDate"
                                    :error="form.validationTrigger[`birthDate-${index}`] && !form.validationState[`birthDate-${index}`] ? t('validation.required') : null"
                                    @date-for-server="(date) => handleBirthDateChange(date, index)"
                                    @valid="(isValid) => form.updateValidationState(`birthDate-${index}`, isValid)">
                                    <template #icon>
                                        <IconsSet name="calendar" class="h-4 w-4 text-text-accent" />
                                    </template>
                                </DateValidation>

                                <!-- Тип документа - обычный select вместо ValidationInput -->
                                <div class="flex flex-col">
                                    <label class="mb-2 text-sm font-medium text-text">{{ t('fields.documentType')
                                        }}</label>
                                    <select :id="`documentType-${index}`" v-model="attendee.documentType"
                                        class="w-full border border-primary-600 rounded-lg px-4 py-2.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all hover:border-primary-500 h-[42px]"
                                        @change="updateDocumentTypeRules(attendee, index)">
                                        <option v-for="option in documentTypeOptions" :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Номер документа с адаптивной валидацией -->
                                <ValidationInput :id="`documentNumber-${index}`" :label="t('fields.documentNumber')"
                                    type="text" v-model="attendee.documentNumber"
                                    :validationRules="getDocumentNumberRules(attendee.documentType)"
                                    :error-messages="getDocumentNumberErrorMessages(attendee.documentType)"
                                    @valid="(isValid) => form.updateValidationState(`documentNumber-${index}`, isValid)"
                                    :triggerValidation="form.validationTrigger[`documentNumber-${index}`]" />
                            </div>
                        </div>

                        <!-- Улучшенная кнопка покупки билета -->
                        <div class="flex justify-between mt-8">
                            <button type="button" @click="goBack"
                                class="px-6 py-3 bg-transparent border border-primary-500 text-text-accent rounded-lg hover:bg-primary-700 transition-colors">
                                {{ t('common.buttons.goBack') }}
                            </button>
                            <button type="submit"
                                class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center justify-center transform hover:scale-[1.02]"
                                :disabled="isSubmitting">
                                <IconsSet name="cart" class="h-5 w-5 mr-2" />
                                {{ t('tickets.purchase.submit', {
                                    count: attendees.length, price: calculateTotalPrice()
                                })
                                }}
                                <span v-if="isSubmitting" class="ml-2 inline-block animate-spin">⟳</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { formatDate, formatDateTime, formatCurrency } from '@/utils/formatterUtils';
import { useFormValidation } from '@/composables/useFormValidation';
import { useEventApi } from '@/composables/api/useEventApi';
import { useAttendeeApi } from '@/composables/api/useAttendeeApi';
import { notificationService } from '@/composables/useNotification';
import { DocumentType } from '@/types/enums/DocumentType';
import type { AttendeeAddRequest } from '@/types/attendee/AttendeeAddRequest';
import type { EventResponse } from '@/types/event/EventResponse';

// Компоненты
import MainNavbar from '@/components/layout/MainNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import ValidationInput from '@/components/ui/ValidationInput.vue';
import DateValidation from '@/components/ui/DateValidation.vue';
import IconsSet from '@/components/ui/icons/IconsSet.vue';

// Максимальное количество билетов
const MAX_TICKETS = 10;

// Подготовка API и утилит
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const eventApi = useEventApi();
const attendeeApi = useAttendeeApi();

// Состояние
const event = ref<EventResponse | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isSubmitting = ref(false);

// Создаем массив билетов (посетителей)
const attendees = ref<AttendeeAddRequest[]>([createEmptyAttendee()]);

// Минимальная дата рождения - 7 лет назад от текущей даты
const minBirthDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100); // Максимальный возраст - 100 лет
    return date;
});

// Максимальная дата рождения - 7 лет назад от текущей даты
const maxBirthDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 7); // Минимальный возраст - 7 лет
    return date;
});

// Рассчитываем длительность события
const formatDuration = computed(() => {
    if (!event.value) return '';

    const startTime = new Date(event.value.startTime);
    const endTime = new Date(event.value.endTime);

    // Разница в миллисекундах
    const diffMillis = endTime.getTime() - startTime.getTime();

    // Конвертируем в часы и минуты
    const diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));

    // Формируем текст длительности
    if (diffHours > 0) {
        if (diffMinutes > 0) {
            return `${t('tickets.duration')}: ${diffHours} ${t('modules.events.time.hours')} ${diffMinutes} ${t('modules.events.time.minutes')}`;
        } else {
            return `${t('tickets.duration')}: ${diffHours} ${t('modules.events.time.hours')}`;
        }
    } else {
        return `${t('tickets.duration')}: ${diffMinutes} ${t('modules.events.time.minutes')}`;
    }
});

// Опции для выбора типа документа
const documentTypeOptions = [
    { value: DocumentType.Passport, label: DocumentType.Passport },
    { value: DocumentType.DriverLicense, label: DocumentType.DriverLicense },
    { value: DocumentType.StudentCard, label: DocumentType.StudentCard },
    { value: DocumentType.BirthCertificate, label: DocumentType.BirthCertificate }
];

// Функция для перевода типа документа
function translateDocumentType(type: DocumentType): string {
    return t(`documentTypes.${type.toLowerCase()}`);
}

// Функция для создания пустого объекта посетителя
function createEmptyAttendee(): AttendeeAddRequest {
    return {
        fullName: '',
        birthDate: '',
        documentType: DocumentType.Passport, // Паспорт по умолчанию
        documentNumber: '',
        ticketId: '' // Будет заполнено после загрузки события
    };
}

// Инициализация формы с валидацией
// Формируем список полей для валидации на основе массива посетителей
const getValidationFields = computed(() => {
    const fields = [];
    for (let i = 0; i < attendees.value.length; i++) {
        fields.push(`fullName-${i}`, `birthDate-${i}`, `documentNumber-${i}`); // Убираем documentType-${i}, так как теперь используем обычный select
    }
    return fields;
});

const form = useFormValidation(getValidationFields.value);

// Функции для валидации номера документа в зависимости от типа
function getDocumentNumberRules(documentType: DocumentType): string {
    switch (documentType) {
        case DocumentType.Passport:
            return 'required|passport'; // Строгая валидация российского паспорта (10 цифр)
        case DocumentType.DriverLicense:
            return 'required|driverLicense'; // Валидация водительского удостоверения
        case DocumentType.StudentCard:
            return 'required|studentCard'; // Валидация студенческого билета
        case DocumentType.BirthCertificate:
            return 'required|birthDocument'; // Валидация для других типов документов
    }
}

function getDocumentNumberErrorMessages(documentType: DocumentType): Record<string, string> {
    const messages: Record<string, string> = {
        required: t('validation.required')
    };

    messages[documentType.toLowerCase()] = t(`validation.document.${documentType}`);
    return messages;
}

// Функция для обновления правил валидации при смене типа документа
function updateDocumentTypeRules(attendee: AttendeeAddRequest, index: number): void {
    // Сбрасываем номер документа при смене типа
    attendee.documentNumber = '';

    // Устанавливаем состояние валидации для поля типа документа как true, поскольку это обычный select
    form.updateValidationState(`documentType-${index}`, true);

    // Триггерим перевалидацию поля номера документа
    setTimeout(() => {
        if (form.validationTrigger[`documentNumber-${index}`] !== undefined) {
            form.validationTrigger[`documentNumber-${index}`] += 1;
        }
    }, 0);
}

// Обработчик изменения даты рождения
function handleBirthDateChange(date: string | null, index: number): void {
    if (date) {
        attendees.value[index].birthDate = date;
        form.updateValidationState(`birthDate-${index}`, true);
    } else {
        attendees.value[index].birthDate = '';
        form.updateValidationState(`birthDate-${index}`, false);
    }
}

// Форматирование цены
function formatPrice(price: number): string {
    return formatCurrency(price, 'RUB');
}

// Расчет общей стоимости
function calculateTotalPrice(): string {
    if (!event.value) return formatPrice(0);
    const total = event.value.price * attendees.value.length;
    return formatPrice(total);
}

// Управление билетами
function addAttendee() {
    if (attendees.value.length < MAX_TICKETS) {
        const newIndex = attendees.value.length;
        attendees.value.push(createEmptyAttendee());

        // Обновляем поля валидации
        const newFields = [`fullName-${newIndex}`, `birthDate-${newIndex}`, `documentNumber-${newIndex}`];
        newFields.forEach(field => {
            form.validationState[field] = false;
            form.validationTrigger[field] = 0;
        });
    }
}

function removeAttendee() {
    if (attendees.value.length > 1) {
        attendees.value.pop();
    }
}

function removeSpecificAttendee(index: number) {
    if (index > 0 && attendees.value.length > 1) {
        attendees.value.splice(index, 1);

        // Обновляем поля валидации - удаляем старые
        const removedFields = [`fullName-${index}`, `birthDate-${index}`, `documentType-${index}`, `documentNumber-${index}`];
        removedFields.forEach(field => {
            delete form.validationState[field];
            delete form.validationTrigger[field];
        });

        // Обновляем индексы полей валидации для оставшихся билетов
        for (let i = index; i < attendees.value.length; i++) {
            const oldIndex = i + 1;
            const fields = [`fullName-${oldIndex}`, `birthDate-${oldIndex}`, `documentType-${oldIndex}`, `documentNumber-${oldIndex}`];
            fields.forEach(oldField => {
                const newField = oldField.replace(`-${oldIndex}`, `-${i}`);
                form.validationState[newField] = form.validationState[oldField];
                form.validationTrigger[newField] = form.validationTrigger[oldField];
                delete form.validationState[oldField];
                delete form.validationTrigger[oldField];
            });
        }
    }
}

// Навигация
function goBack() {
    router.go(-1);
}

// Отправка формы
async function submitForm() {
    form.handleSubmit(async () => {
        isSubmitting.value = true;
        try {
            // Проходим по всем билетам и создаем посетителей
            for (const attendee of attendees.value) {
                // Форматируем дату рождения для API
                const birthDate = new Date(attendee.birthDate);
                attendee.birthDate = birthDate.toISOString();

                // Отправляем запрос на создание
                const result = await attendeeApi.createAttendeeSelf(attendee, {
                    showSuccessNotification: false  // Отключаем авто-уведомления
                });

                if (!result) {
                    throw new Error(t('tickets.purchase.error'));
                }
            }

            // Если все запросы успешны, показываем общее уведомление
            notificationService.success(t('tickets.purchase.success', { count: attendees.value.length }));

            // Редирект на страницу профиля или билетов
            router.push('/profile/tickets');
        } catch (e) {
            notificationService.error(t('tickets.purchase.error'));
            console.error('Error creating attendees:', e);
        } finally {
            isSubmitting.value = false;
        }
    });
}

// Загрузка данных мероприятия
async function loadEventData() {
    isLoading.value = true;
    error.value = null;

    const eventId = route.params.eventId as string;

    try {
        // Получаем данные о мероприятии
        const eventData = await eventApi.getEventById(eventId);

        if (!eventData) {
            error.value = t('errors.entities.event.notFound');
            return;
        }

        event.value = eventData;

        // Заполняем ticketId для всех посетителей
        attendees.value.forEach(attendee => {
            attendee.ticketId = eventData.id;
        });
    } catch (e) {
        console.error('Error loading event:', e);
        error.value = t('errors.entities.event.loadError');
    } finally {
        isLoading.value = false;
    }
}

// Инициализация страницы
onMounted(async () => {
    await loadEventData();
});
</script>

<style scoped>
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #7f5aa8;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
