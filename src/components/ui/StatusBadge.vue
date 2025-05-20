<template>
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium" :class="statusClass">
        {{ statusText }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { TicketStatus } from '@/types/enums/TicketStatus'
import { useStatusTranslation } from '@/composables/useStatusTranslation'

const props = defineProps<{
    type: 'payment' | 'ticket'
    status: PaymentStatus | TicketStatus
}>()

const { translatePaymentStatus, translateTicketStatus, getPaymentStatusClass, getTicketStatusClass } = useStatusTranslation()

const statusText = computed(() => {
    if (props.type === 'payment') {
        return translatePaymentStatus(props.status as PaymentStatus)
    } else {
        return translateTicketStatus(props.status as TicketStatus)
    }
})

const statusClass = computed(() => {
    if (props.type === 'payment') {
        return getPaymentStatusClass(props.status as PaymentStatus)
    } else {
        return getTicketStatusClass(props.status as TicketStatus)
    }
})
</script>
