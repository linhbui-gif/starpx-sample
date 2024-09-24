<template>
  <div class="relative basis-1/4">
    <div class="relative">
      <Input
          @update:model-value="onChangeSearch"
          placeholder="Search..."
          type="text"
          @focus="isFocusing = true"
          @blur="isFocusing = false"
          :value="selectedItem"
      />
      <div class="absolute top-1/2 right-1 -translate-y-1/2" v-if="isFocusing || keyword" @click="handleClear">
        <Icon :path="mdiCloseCircleOutline" class="h-5 w-5 text-gray-900" />
      </div>
    </div>
    <div class="dropdown absolute w-full top-full translate-y-1.5 left-0 bg-gray-900 z-[999] rounded" v-if="visibleDropdown || isFocusing" ref="dropdownSearchContainer">
      <ul v-if="options.length">
        <li v-if="fetching" class="text-white p-3">Loading...</li>
        <li v-if="!fetching" v-for="option in options" :key="option?.value" @click="handleClickItem(option?.label)" class="text-white cursor-pointer p-3 transition hover:bg-blue-600">{{option?.label}}</li>
      </ul>
      <div class="text-white p-3" v-if="options.length === 0">
        No Data
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Input from "@/components/Input/Input.vue";
import {useDebounceFn} from "@vueuse/core";
import {mdiCloseCircleOutline} from "@mdi/js";
import Icon from "@/components/Icon/Icon.vue";
import {defineEmits} from "vue/dist/vue";

const emits = defineEmits<{
  (e: 'onChange', arrSelected: String): void
  (e: 'onClear'): void
}>()
const keyword = ref('')
const isFocusing = ref(false)
const visibleDropdown = ref(false)
const dropdownSearchContainer = ref(null)
const selectedItem = ref('')
const arrSelectedItem = ref([])
const {
  data,
  executeQuery: getObjectSuggestion,
  fetching,
} = await useGetObjectSuggestion({
  variables: computed(() => ({ input: keyword })),
  pause: true,
  requestPolicy: 'network-only',
})
const options = computed<{ label: string; value: string }[]>(() => {
  const matchedTags = data.value?.getObjectSuggestion || []
  return matchedTags && matchedTags.map(item => {
    return {value: item?.id, label: item?.text}
  })
})
const onChangeSearch  = (data:string) => {
  keyword.value = data;
  visibleDropdown.value = true
  handleGetObjectSuggestion()
}
const handleClickItem = (item) => {
  const arr  = [...arrSelectedItem.value, item]
  selectedItem.value = item
  visibleDropdown.value = false
  emits('onChange', arr)
}
const handleGetObjectSuggestion = useDebounceFn(() => {
  getObjectSuggestion()
}, 500)
const handleClickOutside = (event) => {
  if (dropdownSearchContainer.value && !dropdownSearchContainer.value.contains(event.target)) {
    visibleDropdown.value = false;
  }
};

const handleClear = () => {
  selectedItem.value = ''
  emits('onClear')
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>