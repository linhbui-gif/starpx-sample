<template>
  <Suspense>
    <template #default>
      <ListGallery :imageSets="imageSets" :view="view" />
    </template>
    <template #fallback>
      <Spinner theme="block-center" />
    </template>
  </Suspense>
</template>
<script setup lang="ts">
import {GetImageSetSummariesVariables} from "@/graphql/generated";
import {uniqBy} from "lodash";
import ListGallery from "@/containers/ListGallery/ListGallery.vue";
import Spinner from "@/components/Spinner/Spinner.vue";

const galleryStore = useGalleryStore()
const { view, imageSets } = storeToRefs(galleryStore)
const variables = reactive<GetImageSetSummariesVariables>({
  nextToken: null,
  limit: 100,
})

const { data } = await useGetImageSetSummaries({
  variables
})
//Vueuse - Lắng nghe thay đổi của biến data same useEffect
// whenever(data, ({ getImageSetSummaries }) => {
//   hasMore.value = !!getImageSetSummaries.nextToken
//   nextTokenTemp.value = getImageSetSummaries.nextToken
//   const newImageSets = uniqBy(
//       [...imageSets.value, ...(getImageSetSummaries.image_sets || [])],
//       'set_id',
//   )
//   galleryStore.setImageSets(newImageSets)
// })
const newImageSets = uniqBy(
    [...imageSets.value, ...(data?.value?.getImageSetSummaries.image_sets || [])],
    'set_id',
)
galleryStore.setImageSets(newImageSets)
</script>
<style lang="scss">
.fluid-element {
  flex-grow: 1;
  &:nth-last-child(-n + 4) {
    flex-grow: unset;
  }
}
</style>