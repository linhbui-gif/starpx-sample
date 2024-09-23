<template>
  <div :class="wrapClasses">
    <ImageSkeleton
        v-show="isVisibleSkeleton"
        :class="[
        'h-full w-full transition-opacity duration-300',
        isVisibleSkeleton ? 'opacity-100' : 'opacity-0',
        $attrs['class'],
      ]"
    />
    <img
        v-if="!imageError"
        v-bind="$attrs"
        :src="props.src"
        :loading="loading"
        :alt="alt"
        :class="[
        'h-full w-full transition-opacity duration-300',
        !isVisibleSkeleton ? 'opacity-100' : 'opacity-0',
        $attrs['class'],
      ]"
        ref="imageRef"
        @load="onLoad"
        @error="onRetry"
    />
    <div
        v-if="!remainingRetries && imageError"
        class="absolute left-0 top-0 flex h-full w-full items-center justify-center"
    >
      <div class="flex flex-col items-center justify-center gap-2">
        <i class="icon-error-triangle h-7 w-7 bg-red-600"></i>
        Error loading image
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ImgHTMLAttributes } from 'vue'
import ImageSkeleton from './ImageSkeleton.vue'

type Props = {
  src: ImgHTMLAttributes['src']
  loading?: ImgHTMLAttributes['loading']
  alt?: ImgHTMLAttributes['alt']
  wrapClasses?: ImgHTMLAttributes['class']
}
const props = defineProps<Props>()
defineOptions({ inheritAttrs: false })
const imageRef = ref()
const remainingRetries = ref(1) // Number of times to retry the image
const retryTime = ref(2000) // Image reload cycle time (ms)
const imageError = ref(false)

const isVisibleSkeleton = ref(true)
const onLoad = async () => (isVisibleSkeleton.value = false)

const onRetry = () => {
  if (remainingRetries.value) {
    setTimeout(() => {
      // The loop reloads the image every time any image error occurs
      imageRef.value.src = props.src
      remainingRetries.value--
    }, retryTime.value)
    return
  }
  imageError.value = true
  isVisibleSkeleton.value = false
}
</script>
