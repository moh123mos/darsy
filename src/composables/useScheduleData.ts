import { ref, computed } from 'vue'
import type { AppDataEnvelope, SessionItem, ScheduleDay, DayKey } from '../types/schedule'
import type { IScheduleRepository } from '../repositories/scheduleRepository'

const appData = ref<AppDataEnvelope | null>(null)
const isLoaded = ref(false)
const repository = ref<IScheduleRepository | null>(null)

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

  const addSession = (dayKey: DayKey, session: Omit<SessionItem, 'id'>) => {
    const day = getDay(dayKey)
    if (!day) return

    const newSession: SessionItem = {
      ...session,
      id: crypto.randomUUID()
    }
    day.sessions.push(newSession)
    persist()
  }

  const updateSession = (dayKey: DayKey, sessionId: string, updates: Partial<SessionItem>) => {
    const day = getDay(dayKey)
    if (!day) return

    const session = day.sessions.find(s => s.id === sessionId)
    if (session) {
      Object.assign(session, updates)
      persist()
    }
  }

  const deleteSession = (dayKey: DayKey, sessionId: string) => {
    const day = getDay(dayKey)
    if (!day) return

    const index = day.sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      day.sessions.splice(index, 1)
      persist()
    }
  }

  return {
    appData,
    isLoaded,
    days,
    visibleDays,
    getDay,
    hydrate,
    persist,
    addSession,
    updateSession,
    deleteSession
  }
}