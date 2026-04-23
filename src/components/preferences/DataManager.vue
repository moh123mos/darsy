<script setup lang="ts">
import { computed } from 'vue'
import type { AppDataEnvelope } from '../../types/schedule'

const props = defineProps<{
  appData: AppDataEnvelope
}>()

const stats = computed(() => {
  let totalSessions = 0
  let daysWithSessions = 0

  for (const day of props.appData.days) {
    totalSessions += day.sessions.length
    if (day.sessions.length > 0) daysWithSessions++
  }

  return { totalSessions, daysWithSessions }
})

defineEmits<{
  'loadSample': []
  'clearAll': []
}>()
</script>

<template>
  <div class="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-6">
    <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
      <span>📊</span>
      <span>إحصائيات الجدول</span>
    </h3>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-indigo-50 rounded-2xl p-4 text-center">
        <div class="text-3xl font-bold text-indigo-600">{{ stats.totalSessions }}</div>
        <div class="text-sm text-indigo-500">إجمالي المواعيد</div>
      </div>
      <div class="bg-emerald-50 rounded-2xl p-4 text-center">
        <div class="text-3xl font-bold text-emerald-600">{{ stats.daysWithSessions }}</div>
        <div class="text-sm text-emerald-500">أيام بها مواعيد</div>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-medium text-slate-600 mb-2">تحميل بيانات تجريبية</h4>
        <p class="text-xs text-slate-400 mb-3">
          تحميل مواعيد افتراضية للاختبار والتعرف على التطبيق
        </p>
        <button
          @click="$emit('loadSample')"
          class="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-2"
        >
          <span>📥</span>
          <span>تحميل البيانات التجريبية</span>
        </button>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <h4 class="text-sm font-medium text-slate-600 mb-2">إعادة تعيين</h4>
        <p class="text-xs text-slate-400 mb-3">
          حذف جميع المواعيد والعودة للإعدادات الافتراضية
        </p>
        <button
          @click="$emit('clearAll')"
          class="w-full py-3 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          <span>مسح جميع البيانات</span>
        </button>
      </div>
    </div>
  </div>
</template>