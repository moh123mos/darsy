export type Timezone = 'EGYPT' | 'KSA'
export type ThemeMode = 'light' | 'dark' | 'system'
export type DayKey = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

export interface UserProfile {
  userId: string
  displayName: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  timezone: Timezone
  themeMode: ThemeMode
  accentColor: string
  visibleDayKeys: DayKey[]
  defaultSessionType: string
  sessionTypeTemplates: string[]
}

export interface SessionItem {
  id: string
  dayKey: DayKey
  startTime: string
  durationMinutes: number
  studentName: string
  subtitle: string
  type: string
  notes?: string
}

export interface ScheduleDay {
  key: DayKey
  titleAr: string
  icon: string
  colorToken: string
  sessions: SessionItem[]
}

export interface AppDataEnvelope {
  schemaVersion: number
  profile: UserProfile
  preferences: UserPreferences
  days: ScheduleDay[]
}

export const DEFAULT_SESSION_TYPES = [
  'جلسة تعليمية',
  'نشاط ديني',
  'حلقة قرآن',
  'مذاكرة جماعية',
  'اختبار',
  'جلسة مراجعة'
]

export const DAYS_CONFIG: Record<DayKey, { titleAr: string; icon: string; colorToken: string }> = {
  saturday: { titleAr: 'السبت', icon: '🏠', colorToken: 'indigo' },
  sunday: { titleAr: 'الأحد', icon: '💎', colorToken: 'blue' },
  monday: { titleAr: 'الإثنين', icon: '🔥', colorToken: 'green' },
  tuesday: { titleAr: 'الثلاثاء', icon: '⚡', colorToken: 'violet' },
  wednesday: { titleAr: 'الأربعاء', icon: '🚀', colorToken: 'rose' },
  thursday: { titleAr: 'الخميس', icon: '📚', colorToken: 'orange' },
  friday: { titleAr: 'الجمعة', icon: '🕌', colorToken: 'amber' }
}

export const SCHEMA_VERSION = 1