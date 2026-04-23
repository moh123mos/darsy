import { computed } from 'vue'
import type { UserPreferences, Timezone, ThemeMode } from '../types/schedule'
import type { AppDataEnvelope } from '../types/schedule'

export function useUserPreferences(appData: { value: AppDataEnvelope | null }) {
  const preferences = computed<UserPreferences | null>(() => appData.value?.preferences ?? null)

  const timezone = computed<Timezone>(() => preferences.value?.timezone ?? 'EGYPT')
  const themeMode = computed<ThemeMode>(() => preferences.value?.themeMode ?? 'light')
  const accentColor = computed(() => preferences.value?.accentColor ?? '#4f46e5')
  const visibleDayKeys = computed(() => preferences.value?.visibleDayKeys ?? [])
  const defaultSessionType = computed(() => preferences.value?.defaultSessionType ?? 'جلسة تعليمية')
  const sessionTypeTemplates = computed(() => preferences.value?.sessionTypeTemplates ?? [])

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

  const updateVisibleDays = (keys: string[]) => {
    if (preferences.value) {
      preferences.value.visibleDayKeys = keys as any
    }
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

  return {
    preferences,
    timezone,
    themeMode,
    accentColor,
    visibleDayKeys,
    defaultSessionType,
    sessionTypeTemplates,
    updateTimezone,
    updateThemeMode,
    updateAccentColor,
    updateVisibleDays,
    updateDefaultSessionType,
    addSessionTypeTemplate,
    removeSessionTypeTemplate
  }
}