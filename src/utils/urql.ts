import { useSessionStore } from '@/store/sessionStore'
import { Client, cacheExchange, fetchExchange, errorExchange } from '@urql/vue'
import { authExchange } from '@urql/exchange-auth'
import { retryExchange } from '@urql/exchange-retry'

export const createUrqlClient = () =>
	new Client({
		url: import.meta.env.VITE_APPSYNC_CLIENT_URL,
		fetchSubscriptions: true,
		exchanges: [
			cacheExchange,
			retryExchange({
				initialDelayMs: 1000,
				maxDelayMs: 15000,
				randomDelay: true,
				maxNumberAttempts: 2,
				retryIf: (error) => {
					return !!(error.graphQLErrors.length > 0 || error.networkError)
				},
			}),
			authExchange(async (utils) => {
				return {
					addAuthToOperation(operation) {
						const sessionStore = useSessionStore()
						const { JWTtokens } = storeToRefs(sessionStore)
						const token = JWTtokens.value?.access
						
						if (!token) {
							return utils.appendHeaders(operation, {
								'x-api-key': import.meta.env.VITE_APPSYNC_API_KEY,
							})
						}
						
						return utils.appendHeaders(operation, {
							Authorization:
								import.meta.env.VITE_FORCE_AUTH_CUSTOM === 'y' ? `custom-${token}` : token,
						})
					},
					didAuthError(error, _operation) {
						const forbidenMessage = error.graphQLErrors.some((e) => e.message.includes('expired'))
						
						const forbidenStatus = error.response?.status === 401
						
						return forbidenMessage || forbidenStatus
					},
					async refreshAuth() {
						const sessionStore = useSessionStore()
						
						const sessionRes = await getRefreshCognitoSession()
						
						if (!sessionRes) {
							sessionStore.logout({ autoRedirectToLogin: true })
						}
					},
				}
			}),
			errorExchange({
				onError: (error) => {
					if (error.response && error.response?.status === 400) {
						router.push('/400')
					}
				},
			}),
			fetchExchange,
		],
	})

export const urqlClient = createUrqlClient()
