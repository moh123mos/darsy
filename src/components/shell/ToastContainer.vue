<script setup lang="ts">
import { useToast } from '../../composables/useAccessibility'

const { toasts, dismiss } = useToast()

const typeStyles = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-indigo-500 text-white'
}

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'px-6 py-3 rounded-xl shadow-lg pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-md',
            typeStyles[toast.type]
          ]"
          role="alert"
        >
          <span class="text-lg">{{ typeIcons[toast.type] }}</span>
          <span class="flex-1 font-medium">{{ toast.message }}</span>
          <button
            @click="dismiss(toast.id)"
            class="p-1 hover:bg-white/20 rounded-lg transition"
            aria-label="إغلاق"
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
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
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
</style>