<template>
  <router-link
      v-if="typeButton === EButtonType.link"
      class="Button btn"
      :to="to"
      :class="{
      big: size === EButtonSize.big,
      medium: size === EButtonSize.medium,
      small: size === EButtonSize.small,
    }"
  >
    <div v-if="title" class="Button-title">{{ title }}</div>
  </router-link>

  <button
      v-else
      :class="[
          'flex items-center justify-center w-full bg-blue-600 text-gray-100\n'+
'    hover:bg-blue-700\n'+
'      focus:bg-blue-700 focus:shadow-[0px_0px_0px_2px_rgba(255,255,255,1),0px_0px_0px_3px_rgb(212,209,224,1)]\n'+
'      active:bg-blue-700 active:shadow-[0px_0px_0px_2px_rgb(30,64,175,1)] rounded p-2',
      className
      ]"
      :type="typeButton"
      @click="handleButtonClick"
      :disabled="loading"
  >
    <span v-if="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g><circle cx="3" cy="12" r="2" fill="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
    </span>
    <div v-if="title && !loading" class="Button-title">{{ title }}</div>
  </button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import {EButtonSize, EButtonType} from "@/components/Button/Button.enums.ts";
import Icon from "@/components/Icon/Icon.vue";
import {mdiChevronRight, mdiLoading} from "@mdi/js";
const props = withDefaults(
    defineProps<{
      className?: string,
      typeButton?: string,
      title?: string,
      size?: string,
      loading?: boolean,
      to?: string
    }>(),
    {
      size: EButtonSize.medium,
    },
)

const emits = defineEmits(['click']);
const handleButtonClick = () => {
  emits('click');
}
</script>