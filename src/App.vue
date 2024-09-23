<template>
  <PublicLayout>
    <Suspense>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </transition>
      </RouterView>
    </Suspense>
  </PublicLayout>
</template>
<script setup lang="ts">
import PublicLayout from "@/layouts/PublicLayout.vue";
useApiClientProvider()
</script>
