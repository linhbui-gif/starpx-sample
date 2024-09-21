<template>
  <svg
      aria-hidden="true"
      :viewBox="`0 0 ${viewbox} ${viewbox}`"
      :class="['inline-block fill-current leading-none', sizeClass]"
      v-bind="$attrs"
  >
    <path :d="path" />
  </svg>
</template>

<script setup lang="ts">
type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export type SvgIconProps = {
  path: string
  size?: Size
  viewbox?: number
}
const props = withDefaults(defineProps<SvgIconProps>(), {
  size: 'base',
  viewbox: 24,
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-2 w-2'
    case 'sm':
      return 'h-3 w-3'
    case 'base':
      return 'h-4 w-4'
    case 'lg':
      return 'w-6 h-6'
    case 'xl':
      return 'w-8 h-8'
    case '2xl':
      return 'w-10 h-10'
    case '3xl':
      return 'w-12 h-12'
    case '4xl':
      return 'w-16 h-16'
    default:
      return ''
  }
})
</script>
