<script setup lang="ts">
import { useToast } from '../../composables/useAccessibility'

const { toasts, dismiss } = useToast()

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}

const typeBgLight = {
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-indigo-100 text-indigo-800 border-indigo-200'
}
</script>

<template>
  <Teleport to="body">
    <div 
      class="toast-container fixed bottom-4 left-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-4 py-3 md:px-6 md:py-4 rounded-xl flex items-center gap-3 pointer-events-auto border shadow-xl',
            'min-w-[240px] max-w-md',
            typeBgLight[toast.type]
          ]"
          role="alert"
        >
          <span 
            :class="[
              'w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-sm md:text-base font-bold',
              toast.type === 'success' ? 'bg-green-500 text-white' : '',
              toast.type === 'error' ? 'bg-red-500 text-white' : '',
              toast.type === 'info' ? 'bg-indigo-500 text-white' : ''
            ]"
          >
            {{ typeIcons[toast.type] }}
          </span>
          <span class="flex-1 font-medium text-sm md:text-base">{{ toast.message }}</span>
          <button
            @click="dismiss(toast.id)"
            class="p-1.5 hover:bg-black rounded-lg transition-colors"
            aria-label="إغلاق الإشعار"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: slideUp 0.3s ease-in forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.toast-container {
  transform: translateX(-50%);
}
</style>