import { watch, onMounted, onUnmounted } from 'vue'
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

  watch(data, () => {
    if (data.value) {
      debouncedPersist()
    }
  }, { deep: true })

  onMounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      persistFn()
    }
  })

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })
}