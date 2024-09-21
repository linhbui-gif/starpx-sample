<template>
  <div>
    <h1 class="text-2xl text-red font-bold">Home Page</h1>
  </div>
</template>
<script setup lang="ts">
import {GetImageSetSummariesVariables} from "@/graphql/generated";
const variables = reactive<GetImageSetSummariesVariables>({
  nextToken: null,
  limit: 30,
})

const { data } = await useGetImageSetSummaries({
  variables,
  requestPolicy: 'cache-and-network',
})
// console.log ('data', data)
</script>