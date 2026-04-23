<script setup lang="ts">
const props = defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const icons = {
  danger: '⚠️',
  warning: '⚡',
  info: 'ℹ️'
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="$emit('cancel')"
      ></div>

      <div class="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in">
        <div class="text-center">
          <div class="text-5xl mb-4">{{ icons[type || 'info'] }}</div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">{{ title }}</h3>
          <p class="text-slate-500 mb-6">{{ message }}</p>

          <div class="flex gap-3">
            <button
              @click="$emit('cancel')"
              class="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              {{ cancelText || 'إلغاء' }}
            </button>
            <button
              @click="$emit('confirm')"
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-medium transition',
                type === 'danger'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : type === 'warning'
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              ]"
            >
              {{ confirmText || 'تأكيد' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fadeIn 0.2s ease-out;
}
</style>