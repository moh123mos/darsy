<script setup lang="ts">
import type { ScheduleDay } from '../../types/schedule'

defineProps<{
  day: ScheduleDay
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="day-card group cursor-pointer bg-white p-7 rounded-[2.5rem] flex flex-col justify-between h-56 relative overflow-hidden"
    @click="$emit('click')"
  >
    <div :class="`absolute -right-6 -top-6 w-32 h-32 bg-${day.colorToken}-50/50 rounded-full group-hover:scale-110 transition-transform duration-700`"></div>
    <div class="relative z-10 flex flex-col h-full">
      <div class="flex justify-between items-start mb-auto">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-3xl">
          {{ day.icon }}
        </div>
        <div :class="`text-slate-300 group-hover:text-${day.colorToken}-500 transition-colors`">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-bold text-slate-800">{{ day.titleAr }}</h3>
        <div class="flex items-center gap-2 mt-2">
          <span :class="`w-2 h-2 rounded-full ${day.sessions.length > 0 ? day.colorToken + '-500' : 'slate-200'}`"></span>
          <span :class="`text-sm font-medium ${day.sessions.length > 0 ? 'text-slate-600' : 'text-slate-400'}`">
            {{ day.sessions.length > 0 ? day.sessions.length + ' مواعيد' : 'وقت راحة' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-card {
  transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

@media (hover: hover) {
  .day-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }
}
</style>