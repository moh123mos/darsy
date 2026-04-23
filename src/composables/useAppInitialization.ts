import { ref } from 'vue'
import type { AppDataEnvelope } from '../types/schedule'
import type { LocalScheduleRepository, RecoveryResult } from '../repositories/localScheduleRepository'

export interface AppState {
  initialized: boolean
  loading: boolean
  error: string | null
}

export function useAppInitialization(repo: LocalScheduleRepository) {
  const appData = ref<AppDataEnvelope | null>(null)
  const state = ref<AppState>({
    initialized: false,
    loading: true,
    error: null
  })

  const initialize = async (): Promise<AppDataEnvelope | null> => {
    state.value.loading = true
    state.value.error = null

    try {
      const existing = repo.getAppData()
      
      if (existing) {
        appData.value = existing
        state.value.initialized = true
        return existing
      }

      const defaultData = repo.createDefaultData()
      repo.saveAppData(defaultData)
      appData.value = defaultData
      state.value.initialized = true
      return defaultData
    } catch (e) {
      state.value.error = `Failed to initialize: ${e}`
      return null
    } finally {
      state.value.loading = false
    }
  }

  const tryRecover = (): RecoveryResult => {
    const result = repo.recoverFromBackup()
    
    if (result.success) {
      appData.value = repo.getAppData()
    }
    
    return result
  }

  const persist = () => {
    if (appData.value) {
      repo.saveAppData(appData.value)
    }
  }

  const reset = () => {
    repo.clearAllData()
    appData.value = null
    state.value = {
      initialized: false,
      loading: false,
      error: null
    }
  }

  const exportData = (): string => {
    return repo.exportData()
  }

  const importData = (json: string): boolean => {
    const success = repo.importData(json)
    if (success) {
      appData.value = repo.getAppData()
    }
    return success
  }

  return {
    appData,
    state,
    initialize,
    tryRecover,
    persist,
    reset,
    exportData,
    importData
  }
}