<script setup lang="ts">
import type { ScheduleDay } from '../../types/schedule'

defineProps<{
  day: ScheduleDay
}>()

defineEmits<{
  click: []
}>()

const colorClasses: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' }
}
</script>

<template>
  <div
    class="day-card group cursor-pointer bg-white p-5 md:p-7 rounded-2xl md:rounded-[2rem] flex flex-col justify-between min-h-[140px] md:min-h-[200px] relative overflow-hidden border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-lg"
    @click="$emit('click')"
    role="button"
    tabindex="0"
  >
    <div 
      :class="[
        'absolute -right-4 -top-4 md:-right-6 md:-top-6 w-24 h-24 md:w-32 md:h-32 rounded-full transition-transform duration-700',
        colorClasses[day.colorToken]?.bg || 'bg-slate-100'
      ]"
    ></div>
    
    <div class="relative z-10 flex flex-col h-full">
      <div class="flex justify-between items-start mb-auto">
        <div class="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-2xl md:text-3xl">
          {{ day.icon }}
        </div>
        <div :class="['text-slate-300 group-hover:text-indigo-400 transition-colors', colorClasses[day.colorToken]?.text]">
          <svg class="w-5 h-5 md:w-6 md:h-6" style="transform: scaleX(-1)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </div>
      </div>
      <div>
        <h3 class="text-xl md:text-2xl font-bold text-slate-800">{{ day.titleAr }}</h3>
        <div class="flex items-center gap-2 mt-1 md:mt-2">
          <span 
            :class="[
              'w-2 h-2 rounded-full',
              day.sessions.length > 0 ? (colorClasses[day.colorToken]?.text.replace('text-', 'bg-') || 'bg-indigo-500') : 'bg-slate-200'
            ]"
          ></span>
          <span :class="[
            'text-xs md:text-sm font-medium',
            day.sessions.length > 0 ? 'text-slate-600' : 'text-slate-400'
          ]">
            {{ day.sessions.length > 0 ? day.sessions.length + ' مواعيد' : 'وقت راحة' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-card {
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.day-card:hover {
  transform: translateY(-4px) scale(1.01);
}

.day-card:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

@media (hover: hover) {
  .day-card:hover {
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 640px) {
  .day-card:active {
    transform: scale(0.98);
  }
}
</style>