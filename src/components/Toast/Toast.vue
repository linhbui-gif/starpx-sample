<template>
  <div
      :class="[
      'fixed right-0 top-[55px] z-[9999] flex max-w-md flex-col items-end p-4',
      ui.toasts.length === 0 && 'pointer-events-none',
    ]"
  >
    <ToastElement v-for="toast in ui.toasts" :key="toast.id" :toast="toast" />
  </div>
</template>

<script setup lang="ts">
import ToastElement from './Element.vue'

const ui = useUiStore()
</script>
