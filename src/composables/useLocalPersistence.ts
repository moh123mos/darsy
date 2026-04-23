import { watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useLocalPersistence<T>(
  data: Ref<T | null>,
  persistFn: () => void,
  debounceMs = 500
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedPersist = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      persistFn()
    }, debounceMs)
  }

  const cancelPending = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const persistNow = () => {
    cancelPending()
    persistFn()
  }

  watch(data, (newVal) => {
    if (newVal) {
      debouncedPersist()
    }
  }, { deep: true })

  onUnmounted(() => {
    cancelPending()
    persistNow()
  })

  return {
    persistNow,
    cancelPending
  }
}