import { ref, reactive } from 'vue'

export interface NotificationOptions {
  type?: 'success' | 'error' | 'info' | 'warning'
  timeout?: number
}

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout: number
  visible: boolean
  progress: number
  timer: number | null
  progressInterval: number | null
}

const notifications = reactive<Notification[]>([])
let notificationCounter = 0

export function useNotification() {
  const show = (message: string, options: NotificationOptions = {}) => {
    const type = options.type || 'info'
    const timeout = options.timeout !== undefined ? options.timeout : 5000
    const id = ++notificationCounter

    const notification: Notification = {
      id,
      message,
      type,
      timeout,
      visible: true,
      progress: 100,
      timer: null,
      progressInterval: null,
    }

    notifications.unshift(notification)

    if (timeout > 0) {
      notification.progressInterval = window.setInterval(() => {
        if (notification.progress > 0) {
          notification.progress -= 0.5
        }
      }, timeout / 200) as unknown as number

      notification.timer = window.setTimeout(() => {
        closeNotification(id)
      }, timeout) as unknown as number
    }

    return id
  }

  const success = (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
    return show(message, { ...options, type: 'success' })
  }

  const error = (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
    return show(message, { ...options, type: 'error' })
  }

  const info = (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
    return show(message, { ...options, type: 'info' })
  }

  const warning = (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
    return show(message, { ...options, type: 'warning' })
  }

  const closeNotification = (id: number) => {
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      const notification = notifications[index]
      if (notification.timer) clearTimeout(notification.timer)
      if (notification.progressInterval) clearInterval(notification.progressInterval)
      notification.visible = false
      notification.progress = 0
      setTimeout(() => {
        const index = notifications.findIndex((n) => n.id === id)
        if (index !== -1) {
          notifications.splice(index, 1)
        }
      }, 300)
    }
  }

  const closeAll = () => {
    notifications.forEach((n) => closeNotification(n.id))
  }

  return {
    notifications,
    show,
    success,
    error,
    info,
    warning,
    closeNotification,
    closeAll,
  }
}

// Создаем глобальный экземпляр для использования через provide/inject
export const notificationService = useNotification()
