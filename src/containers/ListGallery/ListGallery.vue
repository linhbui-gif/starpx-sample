<template>
  <div class="container mx-auto px-2">
    <div
        ref="containerRef"
        class="-m-2 mt-4 flex flex-wrap gap-[15px]"
        v-if="imageSets.length"
    >
      <div
          class="fluid-element max-h-[300px] overflow-hidden"
          v-for="imagesetItem in imageSets"
          :key="imagesetItem?.set_id"
      >
        <PreviewImage :view="view" :set="imagesetItem" :height="300" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PreviewImage from "@/containers/PreviewImage/PreviewImage.vue";
import {ImageSetSummary} from "@/graphql/generated";
const props = defineProps<{
  imageSets: Partial<ImageSetSummary>
  view: 'classic' | 'fluid'
}>()
const containerRef = ref<HTMLDivElement | null>(null)

</script>