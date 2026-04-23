<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LocalScheduleRepository } from './repositories/localScheduleRepository'
import { useScheduleData } from './composables/useScheduleData'
import { useUserPreferences } from './composables/useUserPreferences'
import { useScheduleUI } from './composables/useScheduleUI'
import { useLocalPersistence } from './composables/useLocalPersistence'
import type { Timezone, DayKey, SessionItem } from './types/schedule'

import HeaderBar from './components/shell/HeaderBar.vue'
import DaysGrid from './components/schedule/DaysGrid.vue'
import SessionList from './components/schedule/SessionList.vue'
import SessionEditor from './components/schedule/SessionEditor.vue'
import PreferencesPanel from './components/preferences/PreferencesPanel.vue'

const repo = new LocalScheduleRepository()
const {
  appData, visibleDays, getDay, hydrate, persist,
  addSession, updateSession, deleteSession, validateSession
} = useScheduleData(repo)

const { timezone, themeMode, accentColor, visibleDayKeys, defaultSessionType, sessionTypeTemplates, updateTimezone } = useUserPreferences(appData)
const { errorMessage, successMessage, showError, showSuccess, currentView, selectedDayKey, navigateToEditor, navigateBack } = useScheduleUI()

const editingSession = ref<SessionItem | null>(null)

useLocalPersistence(appData, persist)

onMounted(() => {
  hydrate()
})

const selectedDay = computed(() => {
  if (!selectedDayKey.value) return null
  return getDay(selectedDayKey.value) ?? null
})

const handleSelectDay = (key: string) => {
  selectedDayKey.value = key as DayKey
  currentView.value = 'day'
}

const handleBack = () => {
  navigateBack()
}

const handleEditSession = (session: SessionItem) => {
  editingSession.value = session
  navigateToEditor(selectedDayKey.value!, session.id)
}

const handleDeleteSession = (sessionId: string) => {
  if (selectedDayKey.value) {
    const result = deleteSession(selectedDayKey.value, sessionId)
    if (result) {
      showSuccess('تم حذف الموعد بنجاح')
    } else {
      showError('فشل حذف الموعد')
    }
  }
}

const handleAddSession = () => {
  editingSession.value = null
  navigateToEditor(selectedDayKey.value!)
}

const handleSaveSession = (session: Omit<SessionItem, 'id'>) => {
  if (!selectedDayKey.value) return

  const validation = validateSession(session)
  if (!validation.valid) {
    showError(validation.errors[0]?.message || 'بيانات غير صالحة')
    return
  }

  if (editingSession.value) {
    const result = updateSession(selectedDayKey.value, editingSession.value.id, session)
    if (result.success) {
      showSuccess('تم تحديث الموعد بنجاح')
    } else {
      showError(result.error?.errors[0]?.message || 'فشل تحديث الموعد')
      return
    }
  } else {
    const result = addSession(selectedDayKey.value, session)
    if (result.success) {
      showSuccess('تم إضافة الموعد بنجاح')
    } else {
      showError(result.error?.errors[0]?.message || 'فشل إضافة الموعد')
      return
    }
  }

  navigateBack()
}

const handleTimezoneChange = (tz: Timezone) => {
  updateTimezone(tz)
  showSuccess(tz === 'KSA' ? 'تم التحويل لتوقيت السعودية' : 'تم التحويل لتوقيت مصر')
}

const handlePreferencesClick = () => {
  currentView.value = 'preferences'
}

const handleUpdateVisibleDays = (keys: DayKey[]) => {
  if (appData.value) {
    appData.value.preferences.visibleDayKeys = keys
    persist()
    showSuccess('تم تحديث الأيام المرئية')
  }
}

const handleUpdateDefaultSessionType = (type: string) => {
  if (appData.value) {
    appData.value.preferences.defaultSessionType = type
    persist()
  }
}

const handleAddSessionType = (type: string) => {
  if (appData.value) {
    if (!appData.value.preferences.sessionTypeTemplates.includes(type)) {
      appData.value.preferences.sessionTypeTemplates.push(type)
      persist()
      showSuccess('تم إضافة نوع جديد')
    }
  }
}

const handleRemoveSessionType = (type: string) => {
  if (appData.value) {
    const index = appData.value.preferences.sessionTypeTemplates.indexOf(type)
    if (index !== -1) {
      appData.value.preferences.sessionTypeTemplates.splice(index, 1)
      persist()
      showSuccess('تم حذف النوع')
    }
  }
}
</script>

<template>
  <div :class="`min-h-screen ${themeMode === 'dark' ? 'dark' : ''}`">
    <div class="app-bg"></div>

    <div v-if="errorMessage" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg animate-pulse">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg animate-pulse">
      {{ successMessage }}
    </div>

    <HeaderBar
      :timezone="timezone"
      @update:timezone="handleTimezoneChange"
      @preferences="handlePreferencesClick"
    />

    <main class="max-w-5xl mx-auto px-6 py-10 md:py-16">
      <template v-if="currentView === 'home'">
        <header class="mb-12 text-center md:text-right">
          <h1 class="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">جدول المواعيد الأسبوعي</h1>
          <p class="text-slate-500 text-lg max-w-2xl leading-relaxed">واعلم رعاك الله أنك مسؤول عن وقتك فأحسن استغلاله فيما يرضي الله.</p>
        </header>

        <DaysGrid :days="visibleDays" @select="handleSelectDay" />

        <div class="mt-16 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
          <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition-transform">🕌</div>
            <div class="text-center md:text-right flex-1">
              <h4 class="text-xl font-bold text-slate-800">التزامات خارج الجدول</h4>
              <p class="text-slate-500 mt-1 leading-relaxed">تذكر موعد حلقة القرآن الكريم بجمعية خاتم المرسلين يومي الأحد والخميس من الساعة الرابعة حتى السادسة مساءً.</p>
            </div>
            <div class="hidden lg:block px-6 py-2 bg-slate-900 text-white text-xs rounded-xl font-medium">ملاحظة هامة</div>
          </div>
        </div>
      </template>

      <template v-else-if="currentView === 'day'">
        <div class="flex items-center justify-between mb-6">
          <button
            @click="handleBack"
            class="back-btn w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm transition-all active:scale-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
          <button
            @click="handleAddSession"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            + إضافة موعد
          </button>
        </div>

        <SessionList
          :day="selectedDay"
          :timezone="timezone"
          @edit="handleEditSession"
          @delete="handleDeleteSession"
        />
      </template>

      <template v-else-if="currentView === 'editor'">
        <div class="flex items-center justify-between mb-6">
          <button
            @click="handleBack"
            class="back-btn w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm transition-all active:scale-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        <SessionEditor
          :session="editingSession"
          :day-key="selectedDayKey!"
          :session-types="sessionTypeTemplates"
          @save="handleSaveSession"
          @cancel="handleBack"
        />
      </template>

      <template v-else-if="currentView === 'preferences'">
        <div class="flex items-center justify-between mb-6">
          <button
            @click="handleBack"
            class="back-btn w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm transition-all active:scale-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        <PreferencesPanel
          :timezone="timezone"
          :theme-mode="themeMode"
          :accent-color="accentColor"
          :visible-day-keys="visibleDayKeys"
          :default-session-type="defaultSessionType"
          :session-type-templates="sessionTypeTemplates"
          @update:timezone="handleTimezoneChange"
          @update:visible-days="handleUpdateVisibleDays"
          @update:default-session-type="handleUpdateDefaultSessionType"
          @add-session-type="handleAddSessionType"
          @remove-session-type="handleRemoveSessionType"
        />
      </template>
    </main>
  </div>
</template>

<style>
:root {
  --primary: #4f46e5;
}

body {
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
}

.app-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 0% 0%, rgba(79, 70, 229, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.03) 0%, transparent 40%);
}

.back-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
}

@media (max-width: 640px) {
  .day-card {
    height: auto;
    min-height: 140px;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse {
  animation: fadeIn 0.3s ease-out;
}
</style>