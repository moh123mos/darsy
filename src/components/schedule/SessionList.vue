<script setup lang="ts">
import type { SessionItem, ScheduleDay, Timezone } from '../../types/schedule'
import DayDetails from './DayDetails.vue'

defineProps<{
  day: ScheduleDay | null
  timezone: Timezone
}>()

defineEmits<{
  'back': []
  'edit': [session: SessionItem]
  'delete': [sessionId: string]
}>()
</script>

<template>
  <DayDetails
    :day="day!"
    :timezone="timezone"
    v-if="day"
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  />
</template>