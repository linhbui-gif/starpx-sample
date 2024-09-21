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
<script lang="ts">
import {defineComponent} from "vue";
import PublicLayout from "@/layouts/PublicLayout.vue";
useApiClientProvider()
export default defineComponent ({
  components: {PublicLayout}
})
</script>
