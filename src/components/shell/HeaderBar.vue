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
const tzStatus = computed(() => props.timezone === 'EGYPT' ? 'توقيت القاهرة' : 'تكة مكة')
const isKsa = computed(() => props.timezone === 'KSA')

const toggleTimezone = () => {
  emit('update:timezone', isKsa.value ? 'EGYPT' : 'KSA')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
    <div class="max-w-5xl mx-auto px-4 md:px-6 py-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 rounded-xl shadow-md flex items-center justify-center text-white">
            <svg class="w-5 h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="font-bold text-slate-800 tracking-tight hidden md:inline text-lg">منصة الإدارة</span>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <button 
            @click="$emit('preferences')"
            class="p-2 md:p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="الإعدادات"
            aria-label="الإعدادات"
          >
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>

          <div class="flex items-center gap-1.5 md:gap-2 bg-slate-100 md:bg-slate-50 p-1 md:p-1.5 rounded-xl md:rounded-full border border-slate-200">
            <span class="text-[9px] md:text-xs font-medium text-slate-600 px-1 md:px-2">{{ tzLabel }}</span>
            <label class="switch cursor-pointer">
              <input type="checkbox" :checked="isKsa" @change="toggleTimezone">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="hidden sm:flex items-center gap-1.5 text-[10px] md:text-xs font-medium px-2 md:px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>{{ tzStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
@media (min-width: 768px) {
  .switch {
    width: 44px;
    height: 24px;
  }
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
@media (min-width: 768px) {
  .slider:before {
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
  }
}
input:checked + .slider { background-color: #4f46e5; }
input:checked + .slider:before { transform: translateX(16px); }
@media (min-width: 768px) {
  input:checked + .slider:before { transform: translateX(20px); }
}
</style>