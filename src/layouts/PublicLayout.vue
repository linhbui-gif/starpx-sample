<template>
  <div class="Layout-public min-h-screen">
    <slot></slot>
    <Toast />
  </div>
</template>
<script setup lang="ts">
import Toast from "@/components/Toast/Toast.vue";
import {clearLocalStorageTokens, getRefreshCognitoSession} from "@/hooks/useCognito.ts";
const router = useRouter()
const uiStore = useUiStore()
const expiredCb = () => {
  clearLocalStorageTokens()
  uiStore.addToast({
    type: 'error',
    message: 'Token expired',
  })
  router.push('/auth/login')
}
const handleExpiredToken  = async () => {
  const res = await getRefreshCognitoSession()
  if (res === false) expiredCb()
}
handleExpiredToken()
</script>