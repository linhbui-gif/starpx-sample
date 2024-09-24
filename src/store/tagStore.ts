import { defineStore, acceptHMRUpdate } from 'pinia'
import {
  useGetImageTags,
  useAddImageTags,
  useDeleteImageTags,
  useTagImageSet,
} from '@/graphql/generated'

interface Tag {
  label: string
  isChecked: boolean
}

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const { executeQuery: getImageTags } = useGetImageTags({ variables: {} })
  const { executeMutation: addImageTagsMutation } = useAddImageTags()
  const { executeMutation: deleteImageTagsMutation } = useDeleteImageTags()
  const { executeMutation: tagImageSetMutation } = useTagImageSet()

  const fetchTags = async () => {
    const { data } = await getImageTags()
    tags.value = data.value?.getImageTags?.map((t) => ({ label: t!, isChecked: false })) ?? []
  }

  const addTag = async (label: string) => {
    tags.value.push({ label, isChecked: false })
    tags.value = tags.value.sort((a, b) => a.label.localeCompare(b.label))

    const result = await addImageTagsMutation({ tags: [label] })
    if (!result.data?.addImageTags) {
      // If API call fails, remove the added tag
      tags.value = tags.value.filter((t) => t.label !== label)
    }
  }
  const deleteTag = async (label: string) => {
    // Remove the tag from the local state first
    tags.value = tags.value.filter((t) => t.label !== label)

    const result = await deleteImageTagsMutation({ tags: [label] })
    if (!result.data?.deleteImageTags) {
      // If API call fails, add the tag back
      tags.value.push({ label, isChecked: false })
      tags.value = tags.value.sort((a, b) => a.label.localeCompare(b.label))
    }
  }

  const toggleTag = async (label: string, isChecked: boolean, imageId: string) => {
    const index = tags.value.findIndex((t) => t.label === label)
    if (index !== -1) {
      tags.value[index].isChecked = isChecked
      await tagImageSetMutation({
        sid: imageId,
        tags: tags.value.filter((t) => t.isChecked).map((t) => t.label),
      })
    }
  }

  const updateSelectedTags = (selectedTags: string[]) => {
    tags.value = tags.value.map((tag) => ({
      ...tag,
      isChecked: selectedTags.includes(tag.label),
    }))
  }

  return {
    tags,
    fetchTags,
    addTag,
    deleteTag,
    toggleTag,
    updateSelectedTags,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagStore, import.meta.hot))
}
