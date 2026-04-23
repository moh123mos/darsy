<script setup lang="ts">
import { ref } from 'vue'
import type { ScheduleDay } from '../../types/schedule'
import DayCard from './DayCard.vue'

const props = defineProps<{
  days: ScheduleDay[]
}>()

const emit = defineEmits<{
  select: [dayKey: string]
}>()

const focusedIndex = ref(-1)

const handleSelect = (dayKey: string) => {
  emit('select', dayKey)
}

const handleKeydown = (e: KeyboardEvent, index: number) => {
  const columns = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = Math.min(index + columns, props.days.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(index - columns, 0)
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusedIndex.value = Math.max(index - 1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      focusedIndex.value = Math.min(index + 1, props.days.length - 1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      handleSelect(props.days[index].key)
      break
  }
}
</script>

<template>
  <div 
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
    role="listbox"
    aria-label="أيام الأسبوع"
  >
    <DayCard
      v-for="(day, index) in days"
      :key="day.key"
      :day="day"
      role="option"
      :tabindex="index === 0 ? 0 : -1"
      @click="handleSelect(day.key)"
      @keydown="handleKeydown($event, index)"
    />
  </div>
</template>