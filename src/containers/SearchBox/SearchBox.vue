<template>
  <div class=" basis-1/4">
    <Input
        @update:model-value="onChangeSearch"
        placeholder="Search..."
        type="text"
    />
  </div>
</template>
<script lang="ts" setup>

import Input from "@/components/Input/Input.vue";
import {useDebounceFn} from "@vueuse/core";
const keyword = ref('')
const visibleDropdown = ref(false)
const {
  data,
  executeQuery: getObjectSuggestion,
  fetching,
} = useGetObjectSuggestion({
  variables: computed(() => ({ input: keyword })),
  pause: true,
  requestPolicy: 'network-only',
})
const options = computed<{ label: string; value: string }[]>(() => {
  const matchedTags = data.value?.getObjectSuggestion || []

  return [...matchedTags]
})
console.log ('opptions', options)
const onChangeSearch  = (data:string) => {
  keyword.value = data;
  handleGetObjectSuggestion()
}
const handleGetObjectSuggestion = useDebounceFn(() => {
  getObjectSuggestion()
}, 500)
</script>