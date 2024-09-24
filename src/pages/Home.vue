<template>
  <div class="-m-2 container px-2 mx-auto mt-3.5">
    <div class="flex justify-between bg-gray-800 p-2.5 rounded">
      <TagFilter/>
      <SearchBox />
    </div>
  </div>
  <Suspense>
    <template #default>
      <ListGallery :loading="fetching || loading" :imageSets="imageSets" :view="view" />
    </template>
    <template #fallback>
      <Spinner theme="block-center" />
    </template>
  </Suspense>
</template>
<script setup lang="ts">
import {
  GetImageSetSummariesFiltered, GetImageSetSummariesFilteredDocument,
  GetImageSetSummariesFilteredVariables,
  GetImageSetSummariesVariables
} from "@/graphql/generated";
import {uniqBy} from "lodash";
import ListGallery from "@/containers/ListGallery/ListGallery.vue";
import Spinner from "@/components/Spinner/Spinner.vue";
import TagFilter from "@/containers/TagFilter/TagFilter.vue";
import SearchBox from "@/containers/SearchBox/SearchBox.vue";

const galleryStore = useGalleryStore()
const { view, imageSets } = storeToRefs(galleryStore)
const variables = reactive<GetImageSetSummariesVariables>({
  nextToken: null,
  limit: 100,
})
const loading = ref(false)
const { data, fetching } = await useGetImageSetSummaries({
  variables,
  requestPolicy: 'cache-and-network',
})
watch(
    () => galleryStore.filterCategories,
    async (newValue) => {
      const params = {...variables, filterIds: newValue}
      if (!newValue.length) {
        galleryStore.setImageSets(data.value?.getImageSetSummaries.image_sets ?? [])
        return
      }
      await getGalleryByCategories(params)
    }, { deep: true }
)
//Vueuse - Lắng nghe thay đổi của biến data same useEffect
const newImageSets = uniqBy(
    [...imageSets.value, ...(data?.value?.getImageSetSummaries.image_sets || [])],
    'set_id',
)
galleryStore.setImageSets(newImageSets)
const getGalleryByCategories = async (params) => {
  try {
    loading.value = true
    const response = await urqlClient.query<GetImageSetSummariesFiltered, GetImageSetSummariesFilteredVariables>(GetImageSetSummariesFilteredDocument, {params})
    const data = response?.data
    if(!response?.error) {
      loading.value = false
      const imageSet = data?.getImageSetSummariesFiltered?.image_sets || []
      galleryStore.setImageSets(imageSet)
    }
  } catch (e) {
    loading.value = false
    console.log ('err', e)
  }
}
</script>
<style lang="scss">
.fluid-element {
  flex-grow: 1;
  &:nth-last-child(-n + 4) {
    flex-grow: unset;
  }
}
</style>