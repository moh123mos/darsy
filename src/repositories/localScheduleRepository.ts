import { DAYS_CONFIG, DEFAULT_SESSION_TYPES, SCHEMA_VERSION } from '../types/schedule'
import type { AppDataEnvelope, DayKey, ScheduleDay, UserPreferences, UserProfile } from '../types/schedule'
import type { IScheduleRepository } from './scheduleRepository'

const STORAGE_KEY = 'schedule-app:v1:user:default'
const BACKUP_KEY = 'schedule-app:v1:backup'

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

  validateAndMigrate(data: unknown): AppDataEnvelope | null {
    if (!data || typeof data !== 'object') {
      return null
    }

    const envelope = data as Record<string, unknown>

    if (typeof envelope.schemaVersion !== 'number' || envelope.schemaVersion !== SCHEMA_VERSION) {
      return null
    }

    if (!envelope.profile || !envelope.preferences || !envelope.days) {
      return null
    }

    return envelope as unknown as AppDataEnvelope
  }

  getAppData(): AppDataEnvelope | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      return this.validateAndMigrate(parsed)
    } catch {
      return null
    }
  }

  saveAppData(data: AppDataEnvelope): void {
    try {
      const existing = this.getAppData()
      if (existing) {
        const backupKey = `${BACKUP_KEY}:${Date.now()}`
        localStorage.setItem(backupKey, JSON.stringify(existing))
      }

      data.profile.updatedAt = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save app data:', error)
    }
  }
}