import { ref, computed } from 'vue'
import type { DayKey } from '../types/schedule'
import { DAYS_CONFIG } from '../types/schedule'

export function useScheduleUI() {
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const currentView = ref<'home' | 'day' | 'editor' | 'preferences'>('home')
  const selectedDayKey = ref<DayKey | null>(null)
  const editingSessionId = ref<string | null>(null)

  const showError = (message: string, durationMs = 3000) => {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = null
    }, durationMs)
  }

  const showSuccess = (message: string, durationMs = 2000) => {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = null
    }, durationMs)
  }

  const clearMessages = () => {
    errorMessage.value = null
    successMessage.value = null
  }

  const navigateTo = (view: typeof currentView.value, dayKey?: DayKey) => {
    currentView.value = view
    selectedDayKey.value = dayKey ?? null
    editingSessionId.value = null
  }

  const navigateToDay = (dayKey: DayKey) => {
    navigateTo('day', dayKey)
  }

  const navigateToEditor = (dayKey: DayKey, sessionId?: string) => {
    selectedDayKey.value = dayKey
    editingSessionId.value = sessionId ?? null
    currentView.value = 'editor'
  }

  const navigateBack = () => {
    if (currentView.value === 'editor') {
      currentView.value = editingSessionId.value ? 'day' : 'home'
      editingSessionId.value = null
    } else if (currentView.value === 'day') {
      currentView.value = 'home'
      selectedDayKey.value = null
    } else {
      currentView.value = 'home'
    }
  }

  const canGoBack = computed(() => currentView.value !== 'home')

  const allDayKeys = computed(() => Object.keys(DAYS_CONFIG) as DayKey[])

  const getDayTitle = (key: DayKey): string => DAYS_CONFIG[key].titleAr
  const getDayIcon = (key: DayKey): string => DAYS_CONFIG[key].icon
  const getDayColor = (key: DayKey): string => DAYS_CONFIG[key].colorToken

  return {
    isLoading,
    errorMessage,
    successMessage,
    currentView,
    selectedDayKey,
    editingSessionId,
    showError,
    showSuccess,
    clearMessages,
    navigateTo,
    navigateToDay,
    navigateToEditor,
    navigateBack,
    canGoBack,
    allDayKeys,
    getDayTitle,
    getDayIcon,
    getDayColor
  }
}

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delayMs = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delayMs)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return { debouncedFn, cancel }
}