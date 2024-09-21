import { Client, provideClient } from '@urql/vue'

type ApiClientContext = {
  client: ComputedRef<Client>
  clearCache: () => void
}
const key = Symbol('api-client') as InjectionKey<ApiClientContext>
export const useApiClientProvider = () => {
  const client = ref(createUrqlClient())
  const clearCache = () => (client.value = createUrqlClient())
  provideClient(client)
  const context: ApiClientContext = {
    client: computed(() => client.value),
    clearCache,
  }
  provide(key, context)
}

export const useApiClient = () => {
  const context = inject(key)
  if (!context) {
    throw new Error('useApiClient must be inside useApiClientProvider')
  }

  return context
}
