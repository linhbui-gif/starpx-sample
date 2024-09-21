<template>
  <div class="Layout-public min-h-screen">
    <slot></slot>
    <Toast />
  </div>
</template>
<script setup lang="ts">
import Toast from "@/components/Toast/Toast.vue";
</script>