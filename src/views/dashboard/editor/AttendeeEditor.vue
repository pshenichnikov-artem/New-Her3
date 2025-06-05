<template>
  <BaseEditor
    :title="isEditMode ? t('attendee.edit') : t('attendee.create')"
    :back-path="'/dashboard/attendees'"
    :is-loading="attendeeApi.isLoading"
    :has-changes="hasChanges"
    @back="goBack"
    @cancel="resetForm"
    @save="saveAttendee"
  >
    <!-- Удалена кнопка переключения режима просмотра/редактирования -->

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin text-4xl text-primary-600">
        <i class="fas fa-spinner"></i>
      </div>
    </div>
    <div v-else-if="attendeeForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Основная информация -->
        <div class="space-y-2">
          <ValidationInput
            id="fullName"
            v-model="attendeeForm.fullName"
            :label="t('attendee.fields.fullName')"
            validation-rules="required|fullName"
            :readonly="isReadOnly"
            :error-messages="{
              required: t('validation.required'),
              fullName: t('validation.fullName.pattern'),
            }"
            :trigger-validation="form.validationTrigger.fullName"
            @valid="form.updateValidationState('fullName', $event)"
          />

          <ValidationInput
            id="birthDate"
            v-model="attendeeForm.birthDate"
            :label="t('attendee.fields.birthDate')"
            type="date"
            validation-rules="required|date"
            :readonly="isReadOnly"
            :min="minBirthDate"
            :max="maxBirthDate"
            :error-messages="{
              required: t('validation.required'),
              date: t('validation.date'),
              dateRange: t('validation.birthDate.range', { min: '-100', max: '-1' }),
            }"
            :trigger-validation="form.validationTrigger.birthDate"
            @valid="validateBirthDate"
          />
        </div>

        <!-- Документы и информация -->
        <div class="space-y-2">
          <div class="form-group">
            <label
              for="documentType"
              class="block mb-1 font-medium text-sm text-text-form"
            >
              {{ t("attendee.fields.documentType") }}
            </label>
            <select
              id="documentType"
              v-model="attendeeForm.documentType"
              class="w-full px-3 py-2 border rounded-lg bg-form-light"
              :disabled="isReadOnly"
              @change="documentTypeChanged"
            >
              <option
                v-for="option in documentTypeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ getDocumentTypeLabel(Number(option.value)) }}
              </option>
            </select>
          </div>

          <ValidationInput
            id="documentNumber"
            v-model="attendeeForm.documentNumber"
            :label="t('attendee.fields.documentNumber')"
            :validation-rules="getDocumentValidationRules()"
            :readonly="isReadOnly"
            :error-messages="getDocumentErrorMessages()"
            :trigger-validation="form.validationTrigger.documentNumber"
            @valid="form.updateValidationState('documentNumber', $event)"
          />
        </div>
      </div>
    </div>
  </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useAttendeeApi } from "@/composables/api/useAttendeeApi";
import type { AttendeeUpdateRequest } from "@/types/attendee/AttendeeUpdateRequest";
import type { AttendeeAddRequest } from "@/types/attendee/AttendeeAddRequest";
import BaseEditor from "@/components/editors/BaseEditor.vue";
import ValidationInput from "@/components/ui/ValidationInput.vue";
import { useNotification } from "@/composables/useNotification";
import { useFormValidation } from "@/composables/useFormValidation";
import { DocumentType } from "@/types/enums/DocumentType";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const attendeeApi = useAttendeeApi();
const notification = useNotification();

const attendeeId = computed(() => route.params.id as string);
const userId = computed(() => route.query.userId as string); // Добавляем получение userId из query
const isEditMode = computed(() => route.name === "dashboard-attendees-edit");
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialAttendeeData = ref<AttendeeUpdateRequest | AttendeeAddRequest | null>(null);
const attendeeForm = ref<AttendeeUpdateRequest>({
  fullName: "",
  birthDate: "",
  documentType: DocumentType.Passport,
  documentNumber: "",
});

// Вычисляем минимальную и максимальную даты для валидации
const maxBirthDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
});

const minBirthDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 100);
  return date.toISOString().split("T")[0]; // Формат YYYY-MM-DD
});

// Обновляем опции для типа документа
const documentTypeOptions = [
  { value: "0", label: t("documentTypes.passport") },
  { value: "1", label: t("documentTypes.driverLicense") },
  { value: "2", label: t("documentTypes.foreignPassport") },
  { value: "3", label: t("documentTypes.studentCard") },
  { value: "4", label: t("documentTypes.birthCertificate") },
];

// Функция для получения локализованного названия типа документа
function getDocumentTypeLabel(type: number): string {
  const typeMap: Record<number, string> = {
    0: "passport",
    1: "driverLicense",
    2: "foreignPassport",
    3: "studentCard",
    4: "birthCertificate",
  };
  return t(`documentTypes.${typeMap[type] || "unknown"}`);
}

// Настраиваем валидацию формы
const form = useFormValidation(["fullName", "birthDate", "documentNumber"]);

const hasChanges = computed(() => {
  if (!attendeeForm.value || !initialAttendeeData.value) return false;
  return JSON.stringify(attendeeForm.value) !== JSON.stringify(initialAttendeeData.value);
});

onMounted(async () => {
  isLoading.value = true;

  if (isEditMode.value) {
    // Убираем автоматическую установку режима чтения
    // isReadOnly.value = true;
    await attendeeApi.getAttendeeById(attendeeId.value, {
      onSuccess: (attendee) => {
        if (attendee) {
          initialAttendeeData.value = {
            fullName: attendee.fullName,
            birthDate: attendee.birthDate.substring(0, 10), // Получаем только дату (YYYY-MM-DD)
            documentType: attendee.documentType,
            documentNumber: attendee.documentNumber,
          };
          attendeeForm.value = { ...initialAttendeeData.value };

          // Проверяем валидность даты для существующего посетителя
          setTimeout(() => {
            validateBirthDate(true);
          }, 0);
        } else {
          notification.error(t("errors.attendeeNotFound"));
          goBack();
        }
      },
      onError: () => {
        notification.error(t("errors.loadingFailed"));
        goBack();
      },
    });
  } else {
    attendeeForm.value = {
      fullName: "",
      birthDate: "",
      documentType: DocumentType.Passport,
      documentNumber: "",
    };
    initialAttendeeData.value = { ...attendeeForm.value };
  }

  isLoading.value = false;
});

// Обработчик изменения типа документа
function documentTypeChanged(): void {
  // Сбрасываем значение документа при изменении типа
  attendeeForm.value.documentNumber = "";

  // Инициируем перевалидацию
  if (form.validationTrigger.documentNumber !== undefined) {
    form.validationTrigger.documentNumber += 1;
  }
}

// Функция для получения правил валидации в зависимости от типа документа
function getDocumentValidationRules(): string {
  switch (attendeeForm.value.documentType) {
    case DocumentType.Passport:
      return "required|passport"; // Паспорт
    case DocumentType.DriverLicense:
      return "required|driverLicense"; // Водительское удостоверение
    case DocumentType.StudentCard:
      return "required|studentCard"; // Студенческий билет
    case DocumentType.BirthCertificate:
      return "required|birthDocument"; // Свидетельство о рождении
    case DocumentType.ForeignPassport:
      return "required|foreignPassport"; // Заграничный паспорт
  }
}

// Функция для получения сообщений об ошибках в зависимости от типа документа
function getDocumentErrorMessages(): Record<string, string> {
  const messages: Record<string, string> = {
    required: t("validation.required"),
    minLength: t("validation.minLength", { min: 3 }),
    pattern: t("validation.pattern"),
  };

  switch (attendeeForm.value.documentType) {
    case DocumentType.Passport:
      messages.passport = t("validation.passport.pattern");
      break;
    case DocumentType.DriverLicense:
      messages.driverLicense = t("validation.driverLicense.pattern");
      break;
    case DocumentType.StudentCard:
      messages.studentCard = t("validation.studentCard.pattern");
      break;
    case DocumentType.BirthCertificate:
      messages.birthDocument = t("validation.birthDocument.pattern");
      break;
    case DocumentType.ForeignPassport:
      messages.foreignPassport = t("validation.foreignPassport.pattern");
      break;
  }

  return messages;
}

// Функция валидации даты рождения
const validateBirthDate = (isValid: boolean) => {
  if (!isValid) {
    form.updateValidationState("birthDate", false);
    return;
  }

  const birthDate = new Date(attendeeForm.value.birthDate);
  const maxDate = new Date(maxBirthDate.value);
  const minDate = new Date(minBirthDate.value);

  // Проверяем, что дата находится в допустимом диапазоне
  if (birthDate > maxDate || birthDate < minDate) {
    form.updateValidationState("birthDate", false);
    // Устанавливаем ошибку с пользовательским сообщением
    if (form.validationTrigger.birthDate !== undefined) {
      form.validationTrigger.birthDate += 1; // Обновляем триггер для отображения ошибки
    }
    return;
  }

  form.updateValidationState("birthDate", true);
};

const goBack = () => {
  // Если пришли со страницы пользователя, возвращаемся на неё
  if (userId.value) {
    router.push(`/dashboard/users/edit/${userId.value}`);
  } else {
    router.push("/dashboard/attendees");
  }
};

const resetForm = () => {
  if (initialAttendeeData.value) {
    attendeeForm.value = { ...initialAttendeeData.value } as AttendeeUpdateRequest & {
      userId?: string | null;
    };
  }
  form.resetValidation();
  notification.info(t("common.changesDiscarded"));
};

const saveAttendee = async () => {
  // Дополнительная проверка даты перед сохранением
  validateBirthDate(!!attendeeForm.value.birthDate);

  if (isEditMode.value) {
    const updateData: AttendeeUpdateRequest = {
      fullName: attendeeForm.value.fullName,
      birthDate: attendeeForm.value.birthDate, // Просто передаем строку с датой
      documentType: attendeeForm.value.documentType,
      documentNumber: attendeeForm.value.documentNumber,
    };

    await attendeeApi.updateAttendee(attendeeId.value, updateData, {
      onSuccess: () => {
        initialAttendeeData.value = { ...updateData };
        notification.success(t("attendee.updateSuccess"));
      },
      onError: () => {
        notification.error(t("attendee.updateFailed"));
      },
    });
  } else {
    const addData: AttendeeAddRequest = {
      fullName: attendeeForm.value.fullName,
      birthDate: attendeeForm.value.birthDate,
      documentType: attendeeForm.value.documentType,
      documentNumber: attendeeForm.value.documentNumber,
    };

    await attendeeApi.createAttendee(
      addData,
      {
        onSuccess: () => {
          notification.success(t("attendee.createSuccess"));
          // Если пришли со страницы пользователя, возвращаемся на неё
          if (userId.value) {
            router.push(`/dashboard/users/edit/${userId.value}`);
          } else {
            router.push("/dashboard/attendees");
          }
        },
        onError: () => {
          notification.error(t("attendee.createFailed"));
        },
      },
      userId.value
    );
  }
};
</script>
