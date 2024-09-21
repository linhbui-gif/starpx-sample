import { UserProfile } from '@/graphql/generated'
export interface ISessionJWTTokens {
	id: string
	access: string
	refresh: string | null
}
export const useSessionStore = defineStore('session', {
  state: () => {
    const JWTtokens = ref<ISessionJWTTokens | null>(null)
    const idProvider = ref<string | null>(null)
    const user = ref<UserProfile | null>(null)
    // NOTE: set user to sentry after login or logout
    const visitorId = ref<string | null>()
    const acceptCookies = ref<boolean>()
    const declineCookies = ref<boolean | null>(null)

    const uiStore = useUiStore()

    const setJWTTokens = (tokens: ISessionJWTTokens, provider?: string) => {
      JWTtokens.value = {
        ...tokens,
      }

      idProvider.value = provider || null
    }
    const setVisitorId = (id: string) => {
      visitorId.value = id
    }

    const setAcceptCookies = () => {
      acceptCookies.value = true
    }

    const setDeclineCookies = () => {
      declineCookies.value = true
    }

    const route = useRoute()
    const router = useRouter()
    type LogoutOptions = {
      notify?: boolean
      autoRedirectToLogin?: boolean
      callback?: () => void
    }
    const logout = (options?: LogoutOptions): void => {
      const { notify = true, autoRedirectToLogin, callback } = options ?? {}
      const handleLogout = (): void => {
        user.value = null
        idProvider.value = null
        JWTtokens.value = null

        clearLocalStorageTokens()

        notify &&
          uiStore.addToast({
            type: 'info',
            message: 'Logout',
          })

        autoRedirectToLogin &&
          router.replace({ path: '/auth/login', query: { redirect: route.fullPath } })
        callback?.()
      }

      if (!idProvider.value) {
        const userPool = getUserPool()
        const cognitoUser = userPool.getCurrentUser()
        if (!cognitoUser) return

        cognitoUser.signOut(handleLogout)
      } else {
        handleLogout()
      }
    }

    return {
      user,
      JWTtokens,
      idProvider,
      visitorId,
      acceptCookies,
      declineCookies,
      setJWTTokens,
      setVisitorId,
      setAcceptCookies,
      setDeclineCookies,
      logout,
    }
  },
  persist: [
    {
      paths: ['acceptCookies'],
      storage: localStorage,
    },
    {
      paths: ['declineCookies'],
      storage: sessionStorage,
    },
  ],
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSessionStore, import.meta.hot))
}
