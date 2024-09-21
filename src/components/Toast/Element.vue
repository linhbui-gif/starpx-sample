<template>
  <div
      class="mb-2 cursor-pointer rounded-md px-4 py-2 text-gray-50"
      :class="[modifiers]"
      :data-id="toast.id"
      @click="handleToastClick"
  >
    <span class="text-base font-medium">{{ toast.message }}</span>
  </div>
</template>

<script setup lang="ts">
export interface IToast extends IToastPayload {
  id: string
  timestamp: number
}
const props = defineProps<{ toast: IToast }>()

const uiStore = useUiStore()
const router = useRouter()

const modifiers = computed(() => [
  props.toast.type === 'success' && 'bg-green-500',
  props.toast.type === 'error' && 'bg-red-500',
  props.toast.type === 'info' && 'bg-blue-500',
])

const handleToastClick = () => {
  if (props.toast.link) {
    router.push(props.toast.link)
  }

  uiStore.removeToast(props.toast.id)
}

const DISPLAY_TIME = 5 * 1000

let timer: NodeJS.Timeout | null = null

onMounted(() => {
  timer = setInterval(() => {
    const timeNow = new Date().getTime()
    if (timeNow - props.toast.timestamp >= DISPLAY_TIME) {
      uiStore.removeToast(props.toast.id)
      timer && clearInterval(timer)
    }
  }, 100)
})

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})
</script>
