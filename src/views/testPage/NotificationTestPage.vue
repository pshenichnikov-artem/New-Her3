<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8 text-indigo-800">Тестирование уведомлений</h1>

        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Управление уведомлениями</h2>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button @click="showSuccessNotification"
                    class="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm">
                    Успех
                </button>

                <button @click="showInfoNotification"
                    class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm">
                    Информация
                </button>

                <button @click="showWarningNotification"
                    class="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium shadow-sm">
                    Предупреждение
                </button>

                <button @click="showErrorNotification"
                    class="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm">
                    Ошибка
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button @click="showMultipleNotifications"
                    class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm">
                    Показать несколько уведомлений
                </button>

                <button @click="clearAllNotifications"
                    class="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-sm">
                    Очистить все уведомления
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { notificationService } from '@/composables/useNotification';

// Стандартный таймаут для всех уведомлений
const TIMEOUT = 5000;

// Специальные типы уведомлений
function showSuccessNotification() {
    notificationService.success('Операция выполнена успешно!', { timeout: TIMEOUT });
}

function showInfoNotification() {
    notificationService.info('Информационное сообщение', { timeout: TIMEOUT });
}

function showWarningNotification() {
    notificationService.warning('Внимание! Это предупреждение.', { timeout: TIMEOUT });
}

function showErrorNotification() {
    notificationService.error('Произошла ошибка!', { timeout: TIMEOUT });
}

// Показ нескольких уведомлений одновременно
function showMultipleNotifications() {
    const types: Array<'success' | 'error' | 'info' | 'warning'> = ['success', 'info', 'warning', 'error'];
    const messages = [
        'Первое уведомление',
        'Второе уведомление',
        'Третье уведомление',
        'Четвертое уведомление'
    ];

    types.forEach((type, index) => {
        setTimeout(() => {
            notificationService.show(messages[index], {
                type: type,
                timeout: TIMEOUT
            });
        }, index * 500); // Показываем с задержкой для эффекта
    });
}

// Функция для очистки всех уведомлений
function clearAllNotifications() {
    notificationService.closeAll();
}
</script>
