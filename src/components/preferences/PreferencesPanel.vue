<script setup lang="ts">
import { ref } from 'vue'
import type { Timezone, ThemeMode, DayKey } from '../../types/schedule'
import { DAYS_CONFIG } from '../../types/schedule'

const props = defineProps<{
  timezone: Timezone
  themeMode: ThemeMode
  accentColor: string
  visibleDayKeys: DayKey[]
  defaultSessionType: string
  sessionTypeTemplates: string[]
}>()

const emit = defineEmits<{
  'update:timezone': [value: Timezone]
  'update:themeMode': [value: ThemeMode]
  'update:accentColor': [value: string]
  'update:visibleDays': [value: DayKey[]]
  'update:defaultSessionType': [value: string]
  'addSessionType': [value: string]
  'removeSessionType': [value: string]
}>()

const newType = ref('')
const dayKeys = Object.keys(DAYS_CONFIG) as DayKey[]

const toggleDay = (key: DayKey) => {
  const current = [...props.visibleDayKeys]
  const index = current.indexOf(key)
  if (index === -1) {
    current.push(key)
  } else {
    current.splice(index, 1)
  }
  emit('update:visibleDays', current)
}

const addType = () => {
  if (newType.value.trim()) {
    emit('addSessionType', newType.value.trim())
    newType.value = ''
  }
}
</script>

<template>
  <div class="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-6 space-y-6">
    <h3 class="text-xl font-bold text-slate-800">الإعدادات</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-2">المنطقة الزمنية</label>
        <div class="flex gap-2">
          <button
            @click="$emit('update:timezone', 'EGYPT')"
            :class="[
              'flex-1 py-2 px-4 rounded-xl transition',
              timezone === 'EGYPT' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            🇪🇬 مصر
          </button>
          <button
            @click="$emit('update:timezone', 'KSA')"
            :class="[
              'flex-1 py-2 px-4 rounded-xl transition',
              timezone === 'KSA' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            🇸🇦 السعودية
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 mb-2">الأيام المرئية</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="key in dayKeys"
            :key="key"
            @click="toggleDay(key)"
            :class="[
              'py-2 px-3 rounded-lg text-sm transition',
              visibleDayKeys.includes(key)
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            ]"
          >
            {{ DAYS_CONFIG[key].titleAr }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 mb-2">نوع الجلسة الافتراضي</label>
        <select
          :value="defaultSessionType"
          @change="$emit('update:defaultSessionType', ($event.target as HTMLSelectElement).value)"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
        >
          <option v-for="type in sessionTypeTemplates" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 mb-2">أنواع الجلسات</label>
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="type in sessionTypeTemplates"
              :key="type"
              class="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-slate-100 text-slate-700 text-sm"
            >
              {{ type }}
              <button @click="$emit('removeSessionType', type)" class="text-slate-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newType"
              type="text"
              class="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              placeholder="إضافة نوع جديد..."
              @keyup.enter="addType"
            />
            <button
              @click="addType"
              :disabled="!newType.trim()"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              إضافة
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>