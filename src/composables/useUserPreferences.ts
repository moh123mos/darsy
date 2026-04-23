import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Timezone, ThemeMode, DayKey } from '../types/schedule'
import type { AppDataEnvelope } from '../types/schedule'

export function useUserPreferences(appData: Ref<AppDataEnvelope | null>) {
  const preferences = computed(() => appData.value?.preferences ?? null)

  const timezone = computed(() => preferences.value?.timezone ?? 'EGYPT')
  const themeMode = computed(() => preferences.value?.themeMode ?? 'light')
  const accentColor = computed(() => preferences.value?.accentColor ?? '#4f46e5')
  const visibleDayKeys = computed(() => preferences.value?.visibleDayKeys ?? [])
  const defaultSessionType = computed(() => preferences.value?.defaultSessionType ?? 'جلسة تعليمية')
  const sessionTypeTemplates = computed(() => preferences.value?.sessionTypeTemplates ?? [])

  const isDark = computed(() => themeMode.value === 'dark')
  const isSystem = computed(() => themeMode.value === 'system')

  const effectiveTheme = computed(() => {
    if (themeMode.value === 'system') {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return 'light'
    }
    return themeMode.value
  })

  const updateTimezone = (tz: Timezone) => {
    if (preferences.value) {
      preferences.value.timezone = tz
    }
  }

  const updateThemeMode = (mode: ThemeMode) => {
    if (preferences.value) {
      preferences.value.themeMode = mode
    }
  }

  const updateAccentColor = (color: string) => {
    if (preferences.value) {
      preferences.value.accentColor = color
    }
  }

  const updateVisibleDays = (keys: DayKey[]) => {
    if (preferences.value) {
      preferences.value.visibleDayKeys = keys
    }
  }

  const toggleDay = (key: DayKey) => {
    if (!preferences.value) return
    const current = [...preferences.value.visibleDayKeys]
    const index = current.indexOf(key)
    if (index === -1) {
      current.push(key)
    } else if (current.length > 1) {
      current.splice(index, 1)
    }
    preferences.value.visibleDayKeys = current
  }

  const updateDefaultSessionType = (type: string) => {
    if (preferences.value) {
      preferences.value.defaultSessionType = type
    }
  }

  const addSessionTypeTemplate = (type: string) => {
    if (preferences.value && !preferences.value.sessionTypeTemplates.includes(type)) {
      preferences.value.sessionTypeTemplates.push(type)
    }
  }

  const removeSessionTypeTemplate = (type: string) => {
    if (preferences.value) {
      const index = preferences.value.sessionTypeTemplates.indexOf(type)
      if (index !== -1) {
        preferences.value.sessionTypeTemplates.splice(index, 1)
      }
    }
  }

  const resetToDefaults = () => {
    if (preferences.value) {
      preferences.value.timezone = 'EGYPT'
      preferences.value.themeMode = 'light'
      preferences.value.accentColor = '#4f46e5'
      preferences.value.visibleDayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'saturday']
      preferences.value.defaultSessionType = 'جلسة تعليمية'
    }
  }

  return {
    preferences,
    timezone,
    themeMode,
    accentColor,
    visibleDayKeys,
    defaultSessionType,
    sessionTypeTemplates,
    isDark,
    isSystem,
    effectiveTheme,
    updateTimezone,
    updateThemeMode,
    updateAccentColor,
    updateVisibleDays,
    toggleDay,
    updateDefaultSessionType,
    addSessionTypeTemplate,
    removeSessionTypeTemplate,
    resetToDefaults
  }
}