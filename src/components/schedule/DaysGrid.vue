<script setup lang="ts">
import type { ScheduleDay } from '../../types/schedule'
import DayCard from './DayCard.vue'

defineProps<{
  days: ScheduleDay[]
}>()

const emit = defineEmits<{
  select: [dayKey: string]
}>()

const handleSelect = (dayKey: string) => {
  emit('select', dayKey)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
    <DayCard
      v-for="day in days"
      :key="day.key"
      :day="day"
      @click="handleSelect(day.key)"
    />
  </div>
</template>