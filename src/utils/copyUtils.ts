import { ref } from 'vue'

/**
 * Хук для копирования текста с визуальной обратной связью (например, "Скопировано!")
 */
export function useCopyWithFeedback(timeout = 1000) {
  const copiedId = ref<string | null>(null)

  function handleCopy(id: string) {
    if (!id) return
    navigator.clipboard.writeText(id).then(() => {
      copiedId.value = id
      setTimeout(() => {
        copiedId.value = null
      }, timeout)
    })
  }

  return { copiedId, handleCopy }
}
