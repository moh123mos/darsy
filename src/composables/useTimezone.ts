import { computed } from 'vue'
import type { Timezone } from '../types/schedule'

type TimezoneSource = { value: Timezone } | { value: () => Timezone }

function getTimezoneValue(source: TimezoneSource): Timezone {
  if (typeof source.value === 'function') {
    return source.value()
  }
  return source.value
}

export function useTimezone(timezone: TimezoneSource) {
  const currentTZ = computed(() => getTimezoneValue(timezone))

  const adjustTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number)
    
    if (currentTZ.value === 'EGYPT') {
      return formatTime(hours, minutes)
    }

    let adjustedHours = hours + 1
    if (adjustedHours > 23) {
      adjustedHours = adjustedHours % 24
    }
    
    return formatTime(adjustedHours, minutes)
  }

  const formatTime = (hours: number, minutes: number): string => {
    const period = hours >= 12 ? 'م' : 'ص'
    const displayHours = hours % 12
    return `${displayHours === 0 ? 12 : displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const parse24Hour = (timeStr: string): { hours: number; minutes: number } | null => {
    const match = timeStr.match(/^(\d{2}):(\d{2})$/)
    if (!match) return null
    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    if (hours > 23 || minutes > 59) return null
    return { hours, minutes }
  }

  const to24Hour = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const compareTimes = (a: string, b: string): number => {
    return a.localeCompare(b)
  }

  const isTimeInRange = (time: string, start: string, end: string): boolean => {
    return time >= start && time <= end
  }

  const parseDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      if (mins === 0) {
        return hours === 1 ? 'ساعة واحدة' : `${hours} ساعات`
      }
      return `${hours} ساعة${hours > 2 ? '' : ' و'} ${mins} دقيقة`
    }
    return `${minutes} دقيقة`
  }

  const formatDurationShort = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      return `${hours}س`
    }
    return `${minutes}د`
  }

  const getTimezoneOffset = (): string => {
    return currentTZ.value === 'EGYPT' ? '+2' : '+3'
  }

  const getTimezoneLabel = (): string => {
    return currentTZ.value === 'EGYPT' ? 'توقيت القاهرة' : 'توقيت مكة المكرمة'
  }

  return {
    currentTZ,
    adjustTime,
    formatTime,
    parse24Hour,
    to24Hour,
    compareTimes,
    isTimeInRange,
    parseDuration,
    formatDurationShort,
    getTimezoneOffset,
    getTimezoneLabel
  }
}