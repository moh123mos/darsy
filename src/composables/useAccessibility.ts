import { ref, onMounted, onUnmounted } from 'vue'

export interface ToastMessage {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

const toasts = ref<ToastMessage[]>([])
let nextId = 0

export function useToast() {
  const show = (message: string, type: ToastMessage['type'] = 'info', duration = 3000) => {
    const id = nextId++
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }, duration)
  }

  const success = (message: string, duration = 3000) => show(message, 'success', duration)
  const error = (message: string, duration = 4000) => show(message, 'error', duration)
  const info = (message: string, duration = 3000) => show(message, 'info', duration)

  const dismiss = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    dismiss,
    clearAll
  }
}

export function useKeyboardNavigation(
  onEscape?: () => void,
  onEnter?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) {
  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onEscape?.()
        break
      case 'Enter':
        if (!e.shiftKey && !e.ctrlKey) {
          onEnter?.()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        onArrowDown?.()
        break
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}

export function useFocusTrap(containerRef: { value: HTMLElement | null }) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const getFocusableElements = () => {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll(focusableElements))
  }

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusables = getFocusableElements()
    if (focusables.length === 0) return

    const first = focusables[0] as HTMLElement
    const last = focusables[focusables.length - 1] as HTMLElement

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleTabKey)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleTabKey)
  })
}

export function useAnnounceForScreenReader() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div')
    el.setAttribute('aria-live', politeness)
    el.setAttribute('aria-atomic', 'true')
    el.setAttribute('class', 'sr-only')
    el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)'
    document.body.appendChild(el)

    setTimeout(() => {
      el.textContent = message
    }, 100)

    setTimeout(() => {
      document.body.removeChild(el)
    }, 1000)
  }

  return { announce }
}