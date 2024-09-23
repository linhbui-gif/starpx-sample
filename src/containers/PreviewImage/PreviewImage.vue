<template>
  <div
      class="set-prewiew relative flex max-h-[300px] items-center justify-center overflow-hidden rounded-md bg-gray-800 cursor-pointer"
      :style="{ minHeight: props.height, minWidth: imageWidth }">
      <div class="hover-visible absolute top-0 z-50 grid h-full w-full place-items-center bg-gray-800/50 text-white">
        <span class="color-gray-500 select-none text-base font-semibold text-white">Click for more</span>
      </div>
    <div class="absolute h-full w-full">
        <ImageLazy
            v-if="imageUrl"
            :src="imageUrl"
            loading="lazy"
            class="object-cover"
            wrap-classes="absolute h-full w-full" />
    </div>
    <div
        :style="{ width: imageWidth + 'px', height: props.height + 'px' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ImageSetSummary } from '@/graphql/generated'
import ImageLazy from "@/components/ImageLazy/ImageLazy.vue";
const props = defineProps<{
  set: Partial<ImageSetSummary>
  view: 'classic' | 'fluid'
  height?: number | string
  width?: number | string
}>()
const emits = defineEmits<{
  (e: 'refresh-data', id: String): void
  (e: 'update-image-caption', id: String, caption: String): void
}>()
defineOptions({ name: 'PreviewImage' })
const fullWidth = props.set?.image_detail?.width || 300
const fullHeight = props.set?.image_detail?.height || 300
const ratio = fullWidth / fullHeight
const imageWidth = Number(props.height) * ratio
const imageSize = computed(() => getImageSize(fullWidth))
const imageProcessed = props.set.channels?.[0]
const imageUrl = imageProcessed?.thumbs?.[imageSize.value] ?? ''
</script>

<style lang="scss">
.hover-visible {
  opacity: 0;
  transition: all 0.2s ease;
}

.set-prewiew:hover {
  .hover-visible {
    opacity: 1;
    transition: all 0.2s ease;
  }
}

.set-prewiew {
  .loader-svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
