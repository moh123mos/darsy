<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = String(err)
  console.error('Vue error boundary caught:', err)
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div v-if="hasError" class="fixed inset-0 z-[100] flex items-center justify-center bg-red-50 p-8">
    <div class="max-w-lg text-center">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-red-800 mb-2">حدث خطأ</h2>
      <p class="text-red-600 mb-6">{{ errorMessage }}</p>
      <button 
        @click="retry" 
        class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        حاول مرة أخرى
      </button>
    </div>
  </div>
  <slot v-else />
</template>