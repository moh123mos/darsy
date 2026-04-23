import { DAYS_CONFIG, DEFAULT_SESSION_TYPES, SCHEMA_VERSION } from '../types/schedule'
import type { AppDataEnvelope, DayKey, ScheduleDay, UserPreferences, UserProfile } from '../types/schedule'
import type { IScheduleRepository } from './scheduleRepository'

const STORAGE_KEY = 'schedule-app:v1:user:default'
const BACKUP_PREFIX = 'schedule-app:v1:backup:'
const MAX_BACKUPS = 5

export interface RecoveryResult {
  success: boolean
  recoveredFrom: string | null
  error?: string
}

export class LocalScheduleRepository implements IScheduleRepository {
  private getDefaultDays(): ScheduleDay[] {
    const keys = Object.keys(DAYS_CONFIG) as DayKey[]
    return keys.map(key => ({
      key,
      titleAr: DAYS_CONFIG[key].titleAr,
      icon: DAYS_CONFIG[key].icon,
      colorToken: DAYS_CONFIG[key].colorToken,
      sessions: []
    }))
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      timezone: 'EGYPT',
      themeMode: 'light',
      accentColor: '#4f46e5',
      visibleDayKeys: Object.keys(DAYS_CONFIG) as DayKey[],
      defaultSessionType: 'جلسة تعليمية',
      sessionTypeTemplates: [...DEFAULT_SESSION_TYPES]
    }
  }

  private getDefaultProfile(): UserProfile {
    return {
      userId: 'default',
      displayName: 'مستخدم جديد',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  createDefaultData(): AppDataEnvelope {
    return {
      schemaVersion: SCHEMA_VERSION,
      profile: this.getDefaultProfile(),
      preferences: this.getDefaultPreferences(),
      days: this.getDefaultDays()
    }
  }

  private hasRequiredFields(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false
    const obj = data as Record<string, unknown>
    return (
      typeof obj.schemaVersion === 'number' &&
      typeof obj.profile === 'object' &&
      typeof obj.preferences === 'object' &&
      Array.isArray(obj.days)
    )
  }

  private hasValidSchema(data: unknown): boolean {
    if (!this.hasRequiredFields(data)) return false
    const obj = data as Record<string, unknown>
    return obj.schemaVersion === SCHEMA_VERSION
  }

  private tryMigrate(data: unknown): AppDataEnvelope | null {
    if (!this.hasRequiredFields(data)) return null
    
    const obj = data as Record<string, unknown>
    const version = obj.schemaVersion as number
    
    if (version < SCHEMA_VERSION) {
      const defaultData = this.createDefaultData()
      
      if (obj.profile) {
        defaultData.profile = { ...defaultData.profile, ...obj.profile as object }
      }
      if (obj.preferences) {
        defaultData.preferences = { ...defaultData.preferences, ...obj.preferences as object }
      }
      if (Array.isArray(obj.days) && obj.days.length > 0) {
        defaultData.days = obj.days as ScheduleDay[]
      }
      
      return defaultData
    }
    
    return null
  }

  validateAndMigrate(data: unknown): AppDataEnvelope | null {
    if (this.hasValidSchema(data)) {
      return data as unknown as AppDataEnvelope
    }
    
    return this.tryMigrate(data)
  }

  private cleanupOldBackups(): void {
    const backups: { key: string; timestamp: number }[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(BACKUP_PREFIX)) {
        const timestamp = parseInt(key.replace(BACKUP_PREFIX, ''), 10)
        if (!isNaN(timestamp)) {
          backups.push({ key, timestamp })
        }
      }
    }
    
    if (backups.length > MAX_BACKUPS) {
      backups.sort((a, b) => b.timestamp - a.timestamp)
      const toDelete = backups.slice(MAX_BACKUPS)
      toDelete.forEach(b => localStorage.removeItem(b.key))
    }
  }

  getAppData(): AppDataEnvelope | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      return this.validateAndMigrate(parsed)
    } catch (e) {
      console.warn('Failed to parse stored data:', e)
      return null
    }
  }

  saveAppData(data: AppDataEnvelope): void {
    try {
      const existing = this.getAppData()
      if (existing) {
        const backupKey = `${BACKUP_PREFIX}${Date.now()}`
        localStorage.setItem(backupKey, JSON.stringify(existing))
        this.cleanupOldBackups()
      }

      data.profile.updatedAt = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save app data:', error)
    }
  }

  recoverFromBackup(): RecoveryResult {
    const backups: { key: string; timestamp: number; data: AppDataEnvelope }[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(BACKUP_PREFIX)) {
        try {
          const raw = localStorage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw)
            const validated = this.validateAndMigrate(parsed)
            if (validated) {
              const timestamp = parseInt(key.replace(BACKUP_PREFIX, ''), 10)
              backups.push({ key, timestamp, data: validated })
            }
          }
        } catch {
          // Skip invalid backups
        }
      }
    }
    
    if (backups.length === 0) {
      return { success: false, recoveredFrom: null, error: 'No backups found' }
    }
    
    backups.sort((a, b) => b.timestamp - a.timestamp)
    const latest = backups[0]
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(latest.data))
      return { success: true, recoveredFrom: latest.key }
    } catch (e) {
      return { success: false, recoveredFrom: latest.key, error: String(e) }
    }
  }

  exportData(): string {
    const data = this.getAppData()
    return data ? JSON.stringify(data, null, 2) : ''
  }

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString)
      const validated = this.validateAndMigrate(parsed)
      if (validated) {
        this.saveAppData(validated)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY)
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(BACKUP_PREFIX)) {
        localStorage.removeItem(key)
        i--
      }
    }
  }
}