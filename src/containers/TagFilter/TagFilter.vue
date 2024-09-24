<template>
  <div class="flex gap-1.5 cursor-pointer basis-1/2" v-if="categories?.length">
    <span
        class="flex items-center text-white rounded-lg border-2 border-blue-600 p-1.5"
        v-for="category in categories"
        :key="category?.id"
        :class="isActive(category?.id)  ? 'bg-blue-600 text-white' : ''"
        @click="toggleActive(category?.id)"
    >
      {{ category?.text }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import {
  GetImageSetSummariesFiltered, GetImageSetSummariesFilteredDocument, GetImageSetSummariesFilteredVariables,
  useGetObjectFilterCatagories
} from "@/graphql/generated";
import {defineEmits} from "vue/dist/vue";
const emits = defineEmits<{
  (event: 'onChange', data: any): void;
}>();
const categories = ref([])
const isActiveTag = ref([])
const galleryStore = useGalleryStore()
const { data } = useGetObjectFilterCatagories();
watchEffect(() => {
  if (data.value) {
    categories.value = data?.value?.getObjectFilterCatagories || [];
  }
});
const isActive = (id: string) => {
  return isActiveTag.value.includes(id);
};
const toggleActive = (id) => {
  if (isActive(id)) {
    isActiveTag.value = isActiveTag.value.filter(i => i !== id);
  } else {
    isActiveTag.value.push(id);
  }
}
watch(() => isActiveTag.value, (newVal) => {
  galleryStore.setFilterCategories(newVal)
}, { deep: true });
</script>