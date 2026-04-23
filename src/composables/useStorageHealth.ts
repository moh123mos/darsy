import type { RecoveryResult } from '../repositories/localScheduleRepository'

export interface StorageHealth {
  healthy: boolean
  sizeBytes: number
  backupCount: number
  lastBackup: string | null
}

export function checkStorageHealth(repo: { 
  getAppData(): any
  recoverFromBackup(): RecoveryResult
}): StorageHealth {
  let sizeBytes = 0
  let backupCount = 0
  let lastBackup: string | null = null

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          sizeBytes += key.length + value.length
        }
        if (key.startsWith('schedule-app:v1:backup:')) {
          backupCount++
          if (!lastBackup || key > lastBackup) {
            lastBackup = key
          }
        }
      }
    }
  } catch {
    // Ignore
  }

  const data = repo.getAppData()
  const healthy = data !== null

  return { healthy, sizeBytes, backupCount, lastBackup }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getStorageUsage(): number {
  let total = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('schedule-app')) {
        total += localStorage.getItem(key)?.length ?? 0
      }
    }
  } catch {
    // Ignore
  }
  return total
}