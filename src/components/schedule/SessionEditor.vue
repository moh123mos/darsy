<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { SessionItem, DayKey } from '../../types/schedule'

const props = defineProps<{
  session: SessionItem | null
  dayKey: DayKey
  sessionTypes: string[]
}>()

const emit = defineEmits<{
  'save': [session: Omit<SessionItem, 'id'>]
  'cancel': []
}>()

const form = ref({
  studentName: '',
  subtitle: '',
  type: 'جلسة تعليمية',
  startTime: '14:00',
  durationMinutes: 60,
  notes: ''
})

watch(() => props.session, (s) => {
  if (s) {
    form.value = {
      studentName: s.studentName,
      subtitle: s.subtitle,
      type: s.type,
      startTime: s.startTime,
      durationMinutes: s.durationMinutes,
      notes: s.notes || ''
    }
  } else {
    form.value = {
      studentName: '',
      subtitle: '',
      type: props.sessionTypes[0] || 'جلسة تعليمية',
      startTime: '14:00',
      durationMinutes: 60,
      notes: ''
    }
  }
}, { immediate: true })

const isValid = computed(() => {
  return form.value.studentName.length >= 2 && 
         form.value.startTime.match(/^\d{2}:\d{2}$/) &&
         form.value.durationMinutes >= 15
})

const formId = computed(() => `session-form-${props.dayKey}`)

const handleSubmit = () => {
  if (!isValid.value) return
  emit('save', {
    dayKey: props.dayKey,
    ...form.value
  })
}
</script>

<template>
  <div class="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm" role="form" :aria-labelledby="`${formId}-title`">
    <h3 :id="`${formId}-title`" class="text-xl font-bold text-slate-800 mb-6">
      {{ session ? 'تعديل الموعد' : 'إضافة موعد جديد' }}
    </h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4" :id="formId">
      <div>
        <label for="studentName" class="block text-sm font-medium text-slate-600 mb-1">اسم الطالب</label>
        <input
          id="studentName"
          v-model="form.studentName"
          type="text"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          placeholder="أدخل اسم الطالب"
          required
          minlength="2"
          maxlength="80"
          autocomplete="off"
        />
      </div>

      <div>
        <label for="subtitle" class="block text-sm font-medium text-slate-600 mb-1">الوصف</label>
        <input
          id="subtitle"
          v-model="form.subtitle"
          type="text"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          placeholder="المستوى الدراسي مثلاً"
        />
      </div>

      <div>
        <label for="sessionType" class="block text-sm font-medium text-slate-600 mb-1">نوع الجلسة</label>
        <select
          id="sessionType"
          v-model="form.type"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
        >
          <option v-for="type in sessionTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="startTime" class="block text-sm font-medium text-slate-600 mb-1">الوقت</label>
          <input
            id="startTime"
            v-model="form.startTime"
            type="time"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            required
          />
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium text-slate-600 mb-1">المدة (دقائق)</label>
          <input
            id="duration"
            v-model.number="form.durationMinutes"
            type="number"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            min="15"
            max="240"
            step="15"
            required
          />
        </div>
      </div>

      <div>
        <label for="notes" class="block text-sm font-medium text-slate-600 mb-1">ملاحظات</label>
        <textarea
          id="notes"
          v-model="form.notes"
          class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          rows="3"
          placeholder="ملاحظات اختيارية..."
        ></textarea>
      </div>

      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
        >
          إلغاء
        </button>
        <button
          type="submit"
          :disabled="!isValid"
          :class="[
            'flex-1 py-3 px-4 rounded-xl font-medium transition',
            isValid 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          ]"
        >
          حفظ
        </button>
      </div>
    </form>
  </div>
</template>