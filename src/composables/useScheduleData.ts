import { ref, computed } from 'vue'
import type { AppDataEnvelope, SessionItem, ScheduleDay, DayKey } from '../types/schedule'
import type { IScheduleRepository } from '../repositories/scheduleRepository'

const appData = ref<AppDataEnvelope | null>(null)
const isLoaded = ref(false)
const repository = ref<IScheduleRepository | null>(null)

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export function useScheduleData(repo: IScheduleRepository) {
  repository.value = repo

  const hydrate = () => {
    const data = repo.getAppData()
    if (data) {
      appData.value = data
    } else {
      appData.value = repo.createDefaultData()
    }
    isLoaded.value = true
  }

  const persist = () => {
    if (appData.value && repository.value) {
      repository.value.saveAppData(appData.value)
    }
  }

  const days = computed(() => appData.value?.days ?? [])

  const getDay = (key: DayKey): ScheduleDay | undefined => {
    return days.value.find(d => d.key === key)
  }

  const visibleDays = computed(() => {
    const visibleKeys = appData.value?.preferences.visibleDayKeys ?? []
    return days.value.filter(d => visibleKeys.includes(d.key))
  })

  const totalSessions = computed(() => {
    return days.value.reduce((sum, day) => sum + day.sessions.length, 0)
  })

  const sessionsByDay = computed(() => {
    const map = new Map<DayKey, SessionItem[]>()
    for (const day of days.value) {
      map.set(day.key, [...day.sessions].sort((a, b) => a.startTime.localeCompare(b.startTime)))
    }
    return map
  })

  const validateSession = (session: Partial<SessionItem>): ValidationResult => {
    const errors: ValidationError[] = []

    if (!session.studentName || session.studentName.length < 2) {
      errors.push({ field: 'studentName', message: 'الاسم يجب أن يكون mínimo 2 حروف' })
    }
    if (session.studentName && session.studentName.length > 80) {
      errors.push({ field: 'studentName', message: 'الاسم يجب أن يكون máximo 80 حرف' })
    }
    if (!session.startTime || !/^\d{2}:\d{2}$/.test(session.startTime)) {
      errors.push({ field: 'startTime', message: 'الوقت غير صالح' })
    }
    if (!session.durationMinutes || session.durationMinutes < 15 || session.durationMinutes > 240) {
      errors.push({ field: 'durationMinutes', message: 'المدة يجب أن تكون بين 15 و 240 دقيقة' })
    }
    if (!session.type) {
      errors.push({ field: 'type', message: 'نوع الجلسة مطلوب' })
    }

    return { valid: errors.length === 0, errors }
  }

  const addSession = (dayKey: DayKey, session: Omit<SessionItem, 'id'>): { success: boolean; error?: ValidationResult } => {
    const validation = validateSession(session)
    if (!validation.valid) {
      return { success: false, error: validation }
    }

    const day = getDay(dayKey)
    if (!day) {
      return { success: false, error: { valid: false, errors: [{ field: 'dayKey', message: 'اليوم غير موجود' }] } }
    }

    const newSession: SessionItem = {
      ...session,
      id: crypto.randomUUID()
    }
    day.sessions.push(newSession)
    persist()

    return { success: true }
  }

  const updateSession = (dayKey: DayKey, sessionId: string, updates: Partial<SessionItem>): { success: boolean; error?: ValidationResult } => {
    const validation = validateSession({ ...getDay(dayKey)?.sessions.find(s => s.id === sessionId), ...updates })
    if (!validation.valid) {
      return { success: false, error: validation }
    }

    const day = getDay(dayKey)
    if (!day) {
      return { success: false, error: { valid: false, errors: [{ field: 'dayKey', message: 'اليوم غير موجود' }] } }
    }

    const session = day.sessions.find(s => s.id === sessionId)
    if (session) {
      Object.assign(session, updates)
      persist()
      return { success: true }
    }

    return { success: false, error: { valid: false, errors: [{ field: 'id', message: 'الموعد غير موجود' }] } }
  }

  const deleteSession = (dayKey: DayKey, sessionId: string): boolean => {
    const day = getDay(dayKey)
    if (!day) return false

    const index = day.sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      day.sessions.splice(index, 1)
      persist()
      return true
    }
    return false
  }

  const getSessionById = (sessionId: string): { session: SessionItem; dayKey: DayKey } | null => {
    for (const day of days.value) {
      const session = day.sessions.find(s => s.id === sessionId)
      if (session) {
        return { session, dayKey: day.key }
      }
    }
    return null
  }

  return {
    appData,
    isLoaded,
    days,
    visibleDays,
    totalSessions,
    sessionsByDay,
    getDay,
    hydrate,
    persist,
    validateSession,
    addSession,
    updateSession,
    deleteSession,
    getSessionById
  }
}