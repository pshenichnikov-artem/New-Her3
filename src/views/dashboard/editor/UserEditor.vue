<template>
  <BaseEditor
    :title="isEditMode ? t('user.edit') : t('user.create')"
    :back-path="'/dashboard/users'"
    :is-loading="userApi.isLoading"
    :has-changes="hasChanges"
    @back="goBack"
    @cancel="resetForm"
    @save="saveUser"
  >
    <div class="flex flex-col h-full space-y-8">
      <div v-if="isLoading" class="flex justify-center py-8 flex-grow">
        <div class="animate-spin text-4xl text-primary-600">
          <i class="fas fa-spinner"></i>
        </div>
      </div>
      <div v-else-if="userForm" class="flex-grow flex flex-col h-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <!-- Основная информация -->
          <div class="space-y-6 bg-primary-900/60 rounded-xl p-6 shadow h-full">
            <ValidationInput
              id="email"
              v-model="userForm.email"
              type="email"
              :label="t('user.fields.email')"
              validation-rules="required|email"
              :readonly="isReadOnly"
              :error-messages="{
                required: t('validation.required'),
                email: t('validation.email.invalid'),
              }"
              :trigger-validation="form.validationTrigger.email"
              @valid="form.updateValidationState('email', $event)"
            />

            <ValidationInput
              id="fullName"
              v-model="userForm.fullName"
              :label="t('user.fields.fullName')"
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
              id="phone"
              v-model="userForm.phone"
              :label="t('user.fields.phone')"
              validation-rules="required|phone"
              :readonly="isReadOnly"
              :error-messages="{
                required: t('validation.required'),
                phone: t('validation.phone.pattern'),
              }"
              :trigger-validation="form.validationTrigger.phone"
              @valid="form.updateValidationState('phone', $event)"
            />

            <ValidationInput
              id="birthDate"
              v-model="userForm.birthDate"
              type="date"
              :label="t('user.fields.birthDate')"
              validation-rules="required|date"
              :readonly="isReadOnly"
              :error-messages="{
                required: t('validation.required'),
                date: t('validation.date'),
              }"
              :trigger-validation="form.validationTrigger.birthDate"
              @valid="form.updateValidationState('birthDate', $event)"
            />
          </div>

          <!-- Дополнительная информация -->
          <div class="space-y-6 bg-primary-900/60 rounded-xl p-6 shadow h-full">
            <!-- Show role select only in edit mode -->
            <div v-if="isEditMode" class="form-group">
              <label for="role" class="block mb-1 font-medium text-sm text-text-form">
                {{ t("user.fields.role") }}
              </label>
              <select
                id="role"
                v-model="userForm.role"
                class="w-full px-3 py-2 border rounded-lg bg-primary-800 text-black"
                :disabled="isReadOnly"
              >
                <option value="0">{{ t("user.roles.user") }}</option>
                <option value="1">{{ t("user.roles.admin") }}</option>
              </select>
            </div>

            <ValidationInput
              v-if="!isEditMode"
              id="password"
              v-model="userForm.password"
              type="password"
              :label="t('user.fields.password')"
              validation-rules="required|password"
              :readonly="isReadOnly"
              :error-messages="{
                required: t('validation.required'),
                password: t('validation.password.pattern'),
              }"
              :trigger-validation="form.validationTrigger.password"
              @valid="form.updateValidationState('password', $event)"
            />
          </div>
        </div>

        <!-- Add after the main form grid -->
        <div v-if="isEditMode" class="flex-shrink-0">
          <h3 class="text-xl font-semibold text-text-accent mb-4">
            {{ t("user.assignedAttendees") }}
          </h3>
          <div class="bg-primary-900/60 rounded-xl p-6 pb-12 mb-8 shadow">
            <div v-if="userAttendees.length === 0" class="text-center text-white py-8">
              {{ t("user.noAttendees") }}
            </div>
            <div v-else>
              <div class="space-y-4 mb-4">
                <div
                  v-for="attendee in userAttendees"
                  :key="attendee.id"
                  class="flex items-center justify-between p-4 bg-primary-800/50 rounded-lg border border-primary-700"
                >
                  <div class="flex-grow">
                    <div class="font-medium text-text-accent">
                      {{ attendee.fullName }}
                    </div>
                    <div class="text-sm text-white">
                      {{
                        t(`documentTypes.${getDocumentTypeKey(attendee.documentType)}`)
                      }}:
                      {{ attendee.documentNumber }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="text-sm text-white">
                      {{ formatDate(attendee.birthDate) }}
                    </div>
                    <button
                      @click="confirmRemoveAttendee(attendee)"
                      class="p-2 text-red-400 hover:text-red-300 transition-colors"
                      :title="t('common.buttons.delete')"
                    >
                      <IconsSet name="trash" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Remove pagination section -->
              <div class="text-sm">
                <span class="text-gray-400">{{ t("pagination.total") }}:</span>
                <span class="text-accent ml-1">{{ userAttendees.length }}</span>
                <span class="text-gray-400 ml-1">{{
                  getPluralForm(userAttendees.length)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Выносим кнопку в отдельный контейнер -->
          <div class="relative -mt-20 flex justify-end pr-4">
            <button
              @click="router.push(`/dashboard/attendees/create?userId=${userId}`)"
              class="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-500 transition-colors shadow-lg flex items-center justify-center"
            >
              <IconsSet name="plus" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Используем только компонент ConfirmModal -->
    <ConfirmModal
      v-if="isRemoveConfirmVisible"
      :title="t('attendee.confirmRemoveTitle')"
      :message="t('attendee.confirmRemoveMessage', { name: attendeeToRemove?.fullName })"
      :confirm-text="t('common.yes')"
      :cancel-text="t('common.no')"
      @confirm="removeAttendee"
      @cancel="cancelRemove"
    />
  </BaseEditor>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useUserApi } from "@/composables/api/useUserApi";
import { useAuthApi } from "@/composables/api/useAuthApi";
import { useAttendeeApi } from "@/composables/api/useAttendeeApi";
import { formatDate } from "@/utils/formatterUtils";
import type { UserUpdateRequest } from "@/types/user/UserUpdateRequest";
import type { RegisterRequest } from "@/types/auth/RegisterRequest";
import BaseEditor from "@/components/editors/BaseEditor.vue";
import ValidationInput from "@/components/ui/ValidationInput.vue";
import IconsSet from "@/components/ui/icons/IconsSet.vue";
import { useNotification } from "@/composables/useNotification";
import { useFormValidation } from "@/composables/useFormValidation";
import { UserRoles } from "@/types/enums/UserRoles";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userApi = useUserApi();
const authApi = useAuthApi();
const attendeeApi = useAttendeeApi();
const notification = useNotification();

const getDocumentTypeKey = (type: number): string => {
  const documentTypes: Record<number, string> = {
    0: "passport",
    1: "driverLicense",
    2: "foreignPassport",
    3: "studentCard",
    4: "birthCertificate",
  };
  return documentTypes[type] || "unknown";
};

const userId = computed(() => route.params.id as string);
const isEditMode = computed(() => route.name === "dashboard-users-edit");
const isLoading = ref(false);
const isReadOnly = ref(false);
const initialUserData = ref<UserUpdateRequest | RegisterRequest | null>(null);

// Создаем интерфейс для Attendee
interface Attendee {
  id: string;
  fullName: string;
  documentType: number;
  documentNumber: string;
  birthDate: string;
}

const userForm = ref<UserUpdateRequest & { password: string }>({
  email: "",
  fullName: "",
  phone: "",
  role: UserRoles.User,
  birthDate: "",
  password: "",
});

const form = useFormValidation(["email", "fullName", "phone", "birthDate", "password"]);

const userAttendees = ref<Attendee[]>([]);

onMounted(async () => {
  isLoading.value = true;

  if (isEditMode.value) {
    await userApi.getUserById(userId.value, {
      onSuccess: (user) => {
        if (user) {
          initialUserData.value = {
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            birthDate: user.birthDate,
          };
          userForm.value = { ...initialUserData.value, password: "" };
        } else {
          notification.error(t("errors.userNotFound"));
          goBack();
        }
      },
      onError: () => {
        notification.error(t("errors.loadingFailed"));
        goBack();
      },
    });

    await attendeeApi.getAttendeesByUser(
      userId.value,
      {
        filter: {
          attendeeIds: [],
          fullName: null,
          birthDateFrom: null,
          birthDateTo: null,
          docType: [],
          docNumber: null,
        },
        pagination: { page: 1, pageSize: 100 }, // Changed from 10 to 5
        sort: [],
      },
      {
        onSuccess: (response) => {
          userAttendees.value = response?.items || [];
        },
        onError: () => {
          notification.error(t("errors.loadingFailed"));
        },
      }
    );
  }

  isLoading.value = false;
});

const goBack = () => {
  router.push("/dashboard/users");
};

const resetForm = () => {
  if (initialUserData.value) {
    userForm.value = {
      ...initialUserData.value,
      password: "",
      role: "role" in initialUserData.value ? initialUserData.value.role : UserRoles.User,
    };
  }
  form.resetValidation();
  notification.info(t("common.changesDiscarded"));
};

const saveUser = async () => {
  // Проверяем только нужные поля в зависимости от режима
  const fieldsToValidate = isEditMode.value
    ? ["email", "fullName", "phone", "birthDate"]
    : ["email", "fullName", "phone", "birthDate", "password"];
  initialUserData.value = { ...userForm.value };
  const isFormValid = fieldsToValidate.every((field) => {
    const isValid = form.validationState[field];
    if (!isValid && form.validationTrigger[field] !== undefined) {
      form.validationTrigger[field] += 1;
    }
    return isValid;
  });

  if (!isFormValid) return;

  if (isEditMode.value) {
    const updateData: UserUpdateRequest = {
      email: userForm.value.email,
      fullName: userForm.value.fullName,
      phone: userForm.value.phone,
      role: userForm.value.role ? +userForm.value.role : null,
      birthDate: userForm.value.birthDate,
    };
    await userApi.updateUser(userId.value, updateData, {
      onSuccess: () => {
        initialUserData.value = { ...updateData, password: "" };
        notification.success(t("user.updateSuccess"));
      },
      onError: () => {
        notification.error(t("user.updateFailed"));
      },
    });
  } else {
    const registerData: RegisterRequest = {
      email: userForm.value.email,
      fullName: userForm.value.fullName,
      phone: userForm.value.phone,
      password: userForm.value.password || "",
      birthDate: userForm.value.birthDate,
    };
    await authApi.register(registerData, {
      onSuccess: () => {
        notification.success(t("user.createSuccess"));
        router.push("/dashboard/users");
      },
      onError: () => {
        notification.error(t("user.createFailed"));
      },
    });
  }
};

// Remove pagination-related code in script
const currentPage = ref(1);

// Добавляем состояние для модального окна подтверждения
const attendeeToRemove = ref<Attendee | null>(null);
const isRemoveConfirmVisible = ref(false);

// Функция подтверждения удаления
const confirmRemoveAttendee = (attendee: Attendee) => {
  attendeeToRemove.value = attendee;
  isRemoveConfirmVisible.value = true;
};

// Функция удаления связи
const removeAttendee = async () => {
  if (!attendeeToRemove.value) return;

  await attendeeApi.dropUserAttendeeLink(attendeeToRemove.value.id, userId.value, {
    onSuccess: () => {
      // Обновляем список после успешного удаления
      userAttendees.value = userAttendees.value.filter(
        (a) => a.id !== attendeeToRemove.value?.id
      );
      notification.success(t("attendee.unlinkSuccess"));
      isRemoveConfirmVisible.value = false;
      attendeeToRemove.value = null;
    },
    onError: () => {
      notification.error(t("attendee.unlinkFailed"));
    },
  });
};

// Функция отмены удаления
const cancelRemove = () => {
  isRemoveConfirmVisible.value = false;
  attendeeToRemove.value = null;
};

const hasChanges = computed(() => {
  if (!initialUserData.value || !userForm.value) return false;
  return Object.keys(initialUserData.value).some(
    (key) =>
      initialUserData.value![key as keyof typeof initialUserData.value] !==
      userForm.value[key as keyof typeof userForm.value]
  );
});

// В script setup добавить:
const getPluralForm = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return t("pagination.entries.one");
  } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return t("pagination.entries.few");
  } else {
    return t("pagination.entries.many");
  }
};
</script>

<style scoped>
.bg-primary-900\/60 {
  background-color: rgba(29, 18, 46, 0.6) !important;
}

.text-accent {
  color: #efe2be !important;
}
</style>
