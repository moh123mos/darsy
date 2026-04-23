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

const accentColors = [
  { name: 'بنفسجي', value: '#4f46e5' },
  { name: 'أزرق', value: '#2563eb' },
  { name: 'أخضر', value: '#059669' },
  { name: 'وردي', value: '#db2777' },
  { name: 'برتقالي', value: '#ea580c' },
  { name: 'أحمر', value: '#dc2626' },
  { name: 'رمادي', value: '#475569' }
]

const themeModes: { label: string; value: ThemeMode; icon: string }[] = [
  { label: 'فاتح', value: 'light', icon: '☀️' },
  { label: 'داكن', value: 'dark', icon: '🌙' },
  { label: 'تلقائي', value: 'system', icon: '💻' }
]

const toggleDay = (key: DayKey) => {
  const current = [...props.visibleDayKeys]
  const index = current.indexOf(key)
  if (index === -1) {
    current.push(key)
  } else if (current.length > 1) {
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
  <div class="space-y-6">
    <div class="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-6">
      <h3 class="text-xl font-bold text-slate-800 mb-6">الإعدادات</h3>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-2">المنطقة الزمنية</label>
          <div class="flex gap-2">
            <button
              @click="$emit('update:timezone', 'EGYPT')"
              :class="[
                'flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center gap-2',
                timezone === 'EGYPT'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>🇪🇬</span>
              <span>مصر</span>
            </button>
            <button
              @click="$emit('update:timezone', 'KSA')"
              :class="[
                'flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center gap-2',
                timezone === 'KSA'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>🇸🇦</span>
              <span>السعودية</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-2">المظهر</label>
          <div class="flex gap-2">
            <button
              v-for="mode in themeModes"
              :key="mode.value"
              @click="$emit('update:themeMode', mode.value)"
              :class="[
                'flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center gap-2',
                themeMode === mode.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
            >
              <span>{{ mode.icon }}</span>
              <span>{{ mode.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-2">اللون الرئيسي</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in accentColors"
              :key="color.value"
              @click="$emit('update:accentColor', color.value)"
              :class="[
                'w-10 h-10 rounded-full transition-transform flex items-center justify-center',
                accentColor === color.value
                  ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                  : 'hover:scale-110'
              ]"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            >
              <span v-if="accentColor === color.value" class="text-white text-sm">✓</span>
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
                'py-2 px-3 rounded-lg text-sm transition flex items-center gap-2',
                visibleDayKeys.includes(key)
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              ]"
            >
              <span>{{ DAYS_CONFIG[key].icon }}</span>
              <span>{{ DAYS_CONFIG[key].titleAr }}</span>
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
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="type in sessionTypeTemplates"
                :key="type"
                class="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-slate-100 text-slate-700 text-sm"
              >
                {{ type }}
                <button
                  v-if="sessionTypeTemplates.length > 1"
                  @click="$emit('removeSessionType', type)"
                  class="text-slate-400 hover:text-red-500 transition"
                >
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
                class="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                placeholder="أضف نوع جديد..."
                @keyup.enter="addType"
              />
              <button
                @click="addType"
                :disabled="!newType.trim()"
                class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>