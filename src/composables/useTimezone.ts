import { computed } from 'vue'
import type { Timezone } from '../types/schedule'

export function useTimezone(timezone: { value: Timezone }) {
  const currentTZ = computed(() => timezone.value)

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

  return {
    currentTZ,
    adjustTime,
    formatTime,
    parseDuration
  }
}