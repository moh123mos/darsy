<script setup lang="ts">
import type { ScheduleDay, SessionItem } from '../../types/schedule'
import { useTimezone } from '../../composables/useTimezone'
import type { Timezone } from '../../types/schedule'

const props = defineProps<{
  day: ScheduleDay
  timezone: Timezone
}>()

defineEmits<{
  'edit': [session: SessionItem]
  'delete': [sessionId: string]
}>()

const { adjustTime, parseDuration } = useTimezone({ value: props.timezone })

const sortedSessions = (sessions: SessionItem[]) => {
  return [...sessions].sort((a, b) => a.startTime.localeCompare(b.startTime))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-slate-900">{{ day.titleAr }}</h2>
        <p class="text-indigo-600 text-sm font-medium mt-1 italic tracking-wide">خطة العمل المجدولة</p>
      </div>
    </div>

    <div v-if="day.sessions.length === 0" class="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
      <div class="text-5xl mb-4 text-slate-200">🍃</div>
      <h3 class="text-xl font-bold text-slate-800">لا توجد أعباء عمل</h3>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="session in sortedSessions(day.sessions)"
        :key="session.id"
        class="session-item bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex flex-row items-center gap-3 md:gap-6 min-h-[90px]"
      >
        <div class="shrink-0 text-center min-w-[60px] md:min-w-[70px]">
          <div class="text-lg md:text-xl font-extrabold text-indigo-600 leading-none">
            {{ adjustTime(session.startTime).split(' ')[0] }}
          </div>
          <div class="text-[10px] font-bold text-slate-400 mt-1 uppercase">
            {{ adjustTime(session.startTime).split(' ')[1] }}
          </div>
        </div>
        
        <div class="self-stretch w-[1.5px] bg-slate-100 shrink-0"></div>
        
        <div class="flex-1 py-1">
          <h4 class="text-sm md:text-lg font-bold text-slate-800 leading-tight">{{ session.studentName }}</h4>
          <p class="text-xs md:text-sm text-slate-500 mt-1 font-medium leading-normal">{{ session.subtitle }}</p>
        </div>

        <div class="shrink-0 flex flex-col items-center justify-center gap-1.5 min-w-[80px] md:min-w-[100px] border-r border-slate-50 pr-2 md:pr-4">
          <span class="text-[9px] md:text-xs font-bold text-indigo-600 bg-indigo-50 px-2 md:px-3 py-1 rounded-full text-center">
            {{ parseDuration(session.durationMinutes) }}
          </span>
          <span class="text-[8px] md:text-[10px] text-slate-400 font-bold text-center leading-tight uppercase tracking-tighter md:tracking-normal">
            {{ session.type }}
          </span>
        </div>

        <div class="flex gap-2">
          <button @click="$emit('edit', session)" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
          <button @click="$emit('delete', session.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.997-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.session-item::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
  border-radius: 4px 0 0 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.session-item:hover::after {
  opacity: 1;
}
</style>