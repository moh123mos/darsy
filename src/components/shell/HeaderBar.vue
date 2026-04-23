<script setup lang="ts">
import { computed } from 'vue'
import type { Timezone } from '../../types/schedule'

const props = defineProps<{
  timezone: Timezone
}>()

const emit = defineEmits<{
  'update:timezone': [value: Timezone]
  'preferences': []
}>()

const tzLabel = computed(() => props.timezone === 'EGYPT' ? 'توقيت مصر' : 'توقيت السعودية')
const tzStatus = computed(() => props.timezone === 'EGYPT' ? 'توقيت القاهرة' : 'توقيت مكة المكرمة')
const isKsa = computed(() => props.timezone === 'KSA')

const toggleTimezone = () => {
  emit('update:timezone', isKsa.value ? 'EGYPT' : 'KSA')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
    <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg shadow-lg flex items-center justify-center text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="font-bold text-slate-800 tracking-tight hidden sm:inline">منصة الإدارة</span>
      </div>

      <div class="flex items-center gap-4">
        <button 
          @click="$emit('preferences')"
          class="p-2 text-slate-400 hover:text-slate-600 transition"
          title="الإعدادات"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>

        <div class="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200">
          <span class="text-[10px] md:text-xs font-bold text-slate-600 px-2">{{ tzLabel }}</span>
          <label class="switch">
            <input type="checkbox" :checked="isKsa" @change="toggleTimezone">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="text-[10px] md:text-xs font-medium px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>{{ tzStatus }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider { background-color: #4f46e5; }
input:checked + .slider:before { transform: translateX(20px); }
</style>