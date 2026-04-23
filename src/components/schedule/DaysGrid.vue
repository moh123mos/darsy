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

const focusedIndex = ref(0)

const handleSelect = (dayKey: string) => {
  emit('select', dayKey)
}

const handleKeydown = (e: KeyboardEvent) => {
  const columns = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value + columns) % props.days.length
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value - columns + props.days.length) % props.days.length
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % props.days.length
      break
    case 'ArrowRight':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value - 1 + props.days.length) % props.days.length
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (props.days[focusedIndex.value]) {
        handleSelect(props.days[focusedIndex.value].key)
      }
      break
  }
}
</script>

<template>
  <div 
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
    role="listbox"
    aria-label="أيام الأسبوع"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <DayCard
      v-for="(day, index) in days"
      :key="day.key"
      :day="day"
      role="option"
      :aria-selected="focusedIndex === index"
      tabindex="-1"
      @click="handleSelect(day.key)"
    />
  </div>
</template>