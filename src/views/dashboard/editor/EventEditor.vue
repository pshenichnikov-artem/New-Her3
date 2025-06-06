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
              minLength: t('validation.minLength', { min: 3 }),
            }" :trigger-validation="form.validationTrigger.title"
            @valid="form.updateValidationState('title', $event)" />

          <!-- Обновление стилей для textarea -->
          <div class="form-group">
            <label for="description" class="block mb-1 font-medium text-sm text-accent">
              {{ t("event.fields.description") }}
            </label>
            <textarea id="description" v-model="eventForm.description"
              class="w-full px-3 py-2 border rounded-lg bg-primary-800 text-white border-primary-600 placeholder:text-gray-400"
              :readonly="isReadOnly"></textarea>
          </div>

          <ValidationInput id="location" v-model="eventForm.location" :label="t('event.fields.location')"
            validation-rules="required" :readonly="isReadOnly" :error-messages="{ required: t('validation.required') }"
            :trigger-validation="form.validationTrigger.location"
            @valid="form.updateValidationState('location', $event)" />

          <ValidationInput id="tag" v-model="eventForm.tag" :label="t('event.fields.tag')" validation-rules="required"
            :readonly="isReadOnly" :error-messages="{ required: t('validation.required') }"
            :trigger-validation="form.validationTrigger.tag" @valid="form.updateValidationState('tag', $event)" />
        </div>

        <!-- Дополнительная информация -->
        <div class="space-y-4">
          <ValidationInput id="startDate" v-model="eventForm.startDate" type="datetime-local"
            :label="t('event.fields.startDate')" validation-rules="required" :readonly="isReadOnly" :error-messages="{
              required: t('validation.required'),
              date: t('validation.date'),
            }" :trigger-validation="form.validationTrigger.startDate"
            @valid="form.updateValidationState('startDate', $event)" />

          <ValidationInput id="endDate" v-model="eventForm.endDate" type="datetime-local"
            :label="t('event.fields.endDate')" validation-rules="date" :readonly="isReadOnly"
            :trigger-validation="form.validationTrigger.endDate" @valid="validateEventDates" />

          <ValidationInput id="ticketCount" v-model.number="eventForm.ticketCount" type="number"
            :label="t('event.fields.ticketsCount')" validation-rules="required|min:0" :readonly="isReadOnly"
            :error-messages="{
              required: t('validation.required'),
              min: t('validation.positive'),
            }" :trigger-validation="form.validationTrigger.ticketCount"
            @valid="form.updateValidationState('ticketCount', $event)" />

          <ValidationInput id="price" v-model.number="eventForm.price" type="number" :label="t('event.fields.price')"
            validation-rules="required|min:0" :readonly="isReadOnly" :error-messages="{
              required: t('validation.required'),
              min: t('validation.positive'),
            }" :trigger-validation="form.validationTrigger.price"
            @valid="form.updateValidationState('price', $event)" />

          <!-- Обновление стилей для чекбокса -->
          <div class="form-group">
            <div class="flex items-center">
              <input id="isActive" type="checkbox" v-model="eventForm.isActive"
                class="h-4 w-4 border-primary-600 rounded mr-2 text-accent bg-primary-800 focus:ring-accent"
                :disabled="isReadOnly" />
              <label for="isActive" class="font-medium text-sm text-accent">
                {{ t("event.fields.isActive") }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Секция для изображений -->
      <div class="mt-6 border-t border-primary-600 pt-4">
        <h3 class="text-lg font-medium mb-4 text-accent">
          {{ t("event.fields.images") }}
        </h3>
        <div class="flex gap-6 overflow-x-auto pb-2" style="scrollbar-color: #674296 #efe2be; scrollbar-width: thin">
          <div v-for="(image, index) in eventForm.images" :key="index"
            class="relative border rounded-lg overflow-hidden flex-shrink-0 w-64 h-48 group bg-primary-800 flex flex-col items-center justify-center">
            {{ console.log("Rendering image", index, image) }}
            <!-- Отображение изображения -->
            <img v-if="getImageUrl(image)" :src="getImageUrl(image)" class="w-full h-full object-cover"
              :alt="`Image ${index + 1}`" />
            <div v-else class="w-full h-full bg-primary-700 flex items-center justify-center">
              <i class="fas fa-image text-primary-300 text-3xl"></i>
            </div>

            <!-- Кнопки перемещения -->
            <div v-if="!isReadOnly" class="absolute bottom-3 left-0 right-0 flex justify-center gap-4 z-20">
              <button @click="moveImageLeft(index)" :disabled="index === 0" type="button"
                class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg border-2 border-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150"
                :title="t('common.buttons.moveLeft')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button @click="moveImageRight(index)" :disabled="index === eventForm.images.length - 1" type="button"
                class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 shadow-lg border-2 border-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150"
                :title="t('common.buttons.moveRight')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <button v-if="!isReadOnly" @click="removeImage(index)" type="button"
              class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg border-2 border-white z-30 flex items-center justify-center transition-all duration-150"
              :title="t('common.buttons.delete')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 font-bold" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <!-- Кнопка добавления изображения -->
          <div v-if="!isReadOnly" @click="triggerImageUpload"
            class="border-2 border-dashed border-primary-600 rounded-lg flex items-center justify-center w-64 h-48 cursor-pointer hover:bg-primary-800 flex-shrink-0">
            <div class="text-center">
              <i class="fas fa-plus text-primary-500 text-2xl mb-1"></i>
              <p class="text-sm text-primary-500">{{ t("event.addImage") }}</p>
            </div>
          </div>

          <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" multiple />
        </div>
      </div>
    </div>
  </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useEventApi } from "@/composables/api/useEventApi";
import type { EventUpdateRequest } from "@/types/event/EventUpdateRequest";
import type { EventAddRequest } from "@/types/event/EventAddRequest";
import type { ImageAddRequest } from "@/types/image/ImageAddRequest";
import type { EventImageUpdateRequest } from "@/types/event/EventImageUpdateRequest";
import type { ImageResponse } from "@/types/image/ImageResponse";
import type { ImageUpdateRequest } from "@/types/image/ImageUpdateRequest";
import BaseEditor from "@/components/editors/BaseEditor.vue";
import ValidationInput from "@/components/ui/ValidationInput.vue";
import { useNotification } from "@/composables/useNotification";
import { useFormValidation } from "@/composables/useFormValidation";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const eventApi = useEventApi();
const notification = useNotification();

const eventId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === "dashboard-events-edit");
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialEventData = ref<EventUpdateRequest | EventAddRequest | null>(null);

// Создаем форму с правильными типами данных
const eventForm = ref<EventUpdateRequest>({
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  ticketCount: 0,
  images: [],
  price: 0,
  isActive: true,
  tag: "",
});

// Настраиваем валидацию формы
const form = useFormValidation([
  "title",
  "location",
  "startDate",
  "endDate",
  "ticketCount",
  "tag",
  "price",
]);

const imageInput = ref<HTMLInputElement | null>(null);

// Удаляем drag-and-drop переменные и методы

const hasChanges = computed(() => {
  if (!eventForm.value || !initialEventData.value) return false;

  // Сравниваем основные поля без изображений
  const currentWithoutImages = { ...eventForm.value };
  delete (currentWithoutImages as any).images;

  const initialWithoutImages = { ...initialEventData.value };
  delete (initialWithoutImages as any).images;

  return (
    JSON.stringify(currentWithoutImages) !== JSON.stringify(initialWithoutImages) ||
    eventForm.value.images.length !==
    ((initialEventData.value as any)?.images?.length || 0)
  );
});

// Функция для получения URL изображения
const getImageUrl = (image: EventImageUpdateRequest): string => {
  console.log("Getting image URL for", image);
  if (image.id && (image as any).imageUrl) {
    return (image as any).imageUrl || "";
  }
  // Если это новое изображение с файлом
  if (image.image) {
    return URL.createObjectURL(image.image);
  }
  return "";
};

onMounted(async () => {
  isLoading.value = true;

  if (isEditMode.value) {
    console.log("Loading event data for edit mode", eventId.value);
    await eventApi.getEventById(eventId.value, {
      onSuccess: (event) => {
        console.log("Event data received:", event);
        if (event) {
          console.log("Mapping event images for form", event.images);
          // Преобразуем изображения из ответа API в формат для формы
          const mappedImages = (event.images || []).map((img: any): EventImageUpdateRequest => ({
            id: img.id,
            imageUrl: img.imageUrl,
            localOrderRank: img.localOrderRank,
            image: undefined,
          }));

          initialEventData.value = {
            title: event.title,
            description: event.description,
            location: event.location,
            startDate: formatDateTimeForInput(event.startTime),
            endDate: formatDateTimeForInput(event.endTime),
            ticketCount: event.ticketsCount || 0,
            images: mappedImages,
            price: event.price,
            isActive: event.isActive,
            tag: event.tag || "",
          };
          eventForm.value = { ...initialEventData.value };
          console.log("Event data loaded:", eventForm.value);
        } else {
          notification.error(t("errors.eventNotFound"));
          goBack();
        }
      },
      onError: () => {
        notification.error(t("errors.loadingFailed"));
        goBack();
      },
    });
  } else {
    // Для создания события используем EventUpdateRequest-совместимую структуру
    const addData: EventUpdateRequest = {
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      ticketCount: 0,
      images: [],
      price: 0,
      isActive: true,
      tag: "",
    };
    initialEventData.value = addData;
    eventForm.value = { ...addData };
  }

  isLoading.value = false;
});

// Функция для валидации дат мероприятия
const validateEventDates = (isValid: boolean) => {
  if (!isValid || !eventForm.value.endDate) {
    return form.updateValidationState("endDate", true); // Необязательное поле
  }

  const startDate = new Date(eventForm.value.startDate);
  const endDate = new Date(eventForm.value.endDate);

  if (endDate < startDate) {
    form.updateValidationState("endDate", false);

    if (form.validationTrigger.endDate !== undefined) {
      form.validationTrigger.endDate += 1;
    }
    return;
  }

  form.updateValidationState("endDate", true);
};

// Форматирование даты/времени для полей input type="datetime-local"
const formatDateTimeForInput = (dateTimeString: string): string => {
  if (!dateTimeString) return "";

  try {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16); // Формат "YYYY-MM-DDThh:mm"
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Функции для работы с изображениями
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click();
  }
};

const handleFilesUpload = async (files: FileList) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      // Всегда добавляем id: "" для совместимости с EventUpdateRequest
      const newImage: EventImageUpdateRequest = {
        id: "",
        image: file,
        localOrderRank: eventForm.value.images.length + i,
      };
      eventForm.value.images.push(newImage);
    } catch (error) {
      notification.error(t("errors.imageUploadFailed"));
      console.error("Error uploading image:", error);
    }
  }
  if (imageInput.value) {
    imageInput.value.value = "";
  }
};

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;
  await handleFilesUpload(files);
};

const removeImage = (index: number) => {
  eventForm.value.images.splice(index, 1);
  // Пересчитываем порядковые номера после удаления
  eventForm.value.images.forEach((img, idx) => {
    if (img.image) img.localOrderRank = idx;
  });
};

const goBack = () => {
  router.push("/dashboard/events");
};

const resetForm = () => {
  if (initialEventData.value) {
    eventForm.value = { ...initialEventData.value } as typeof eventForm.value;
  }
  form.resetValidation();
  notification.info(t("common.changesDiscarded"));
};

const saveEvent = async () => {
  // Проверка валидности дат перед сохранением
  if (eventForm.value.endDate) {
    validateEventDates(true);
  }

  const formData = new FormData();
  const data = { ...eventForm.value };

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("location", data.location);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate || data.startDate);
  formData.append("ticketCount", data.ticketCount.toString());
  formData.append("price", data.price.toString());
  formData.append("isActive", data.isActive ? "true" : "false");
  formData.append("tag", data.tag);

  // Картинки
  data.images.forEach((img, idx) => {
    formData.append(`images[${idx}].id`, img.id || "");
    if (img.image) {
      formData.append(`images[${idx}].image`, img.image);
    }

    formData.append(
      `images[${idx}].localOrderRank`,
      (img.localOrderRank ?? idx).toString()
    );

  });

  if (isEditMode.value) {
    await eventApi.updateEvent(eventId.value, formData, {
      onSuccess: () => {
        initialEventData.value = { ...eventForm.value };
      },
      onError: () => {
        notification.error(t("event.updateFailed"));
      },
    });
  } else {
    await eventApi.createEvent(formData, {
      onSuccess: () => {
        router.push("/dashboard/events");
      },
      onError: () => {
        notification.error(t("event.createFailed"));
      },
    });
  }
};

// Перемещение изображений по стрелкам
const moveImageLeft = (index: number) => {
  if (index <= 0) return;
  const images = eventForm.value.images;
  [images[index - 1], images[index]] = [images[index], images[index - 1]];
  images.forEach((img, idx) => {
    if (img.image) img.localOrderRank = idx;
  });
};

const moveImageRight = (index: number) => {
  const images = eventForm.value.images;
  if (index >= images.length - 1) return;
  [images[index], images[index + 1]] = [images[index + 1], images[index]];
  images.forEach((img, idx) => {
    if (img.image) img.localOrderRank = idx;
  });
};
</script>

<style scoped>
.text-accent {
  color: #efe2be !important;
}

.bg-primary-800 {
  background-color: #3d2566 !important;
}

.bg-primary-700 {
  background-color: #674296 !important;
}

.border-primary-600 {
  border-color: #7c56bb !important;
}

.bg-primary-900\/60 {
  background-color: rgba(29, 18, 46, 0.6) !important;
}

input[type="datetime-local"] {
  color-scheme: dark;
}
</style>
