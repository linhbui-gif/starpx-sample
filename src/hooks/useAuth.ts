import { CombinedError } from '@urql/vue'
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js'

type LoginForm = {
	email: string
	password: string
}

export const useAuth = () => {
	const sessionStore = useSessionStore()
	const { executeMutation: login, fetching } = useSetUserProfile()
	const loading = ref(false)
	const isLoggedIn = ref(false)
	const handleLogin = (options: {
		form: LoginForm
		onLoginSuccess?: () => void
		onLoginError?: (error: string) => void
		onAuthenticateFailure?: (error: any, cognitoUser: CognitoUser) => void
	}) => {
		if (loading.value || isLoggedIn.value) {
			return
		}
		loading.value = true
		
		const { form, onLoginSuccess, onLoginError, onAuthenticateFailure } = options
		const onAuthenticateAwsSuccess = async (session: CognitoUserSession) => {
			const tokens = getJWTfromCognitoSession(session)
			sessionStore.setJWTTokens(tokens)
			
			try {
				const { data, error } = await login({ profile: JSON.stringify({ email: form.email }) })
				if (error) {
					throw error
				}
				if (!data?.setUserProfile) return
				isLoggedIn.value = true
				sessionStore.setUser(data.setUserProfile)
				onLoginSuccess?.()
			} catch (error) {
				onLoginError?.(verboseUrqlError(error as CombinedError))
			} finally {
				loading.value = false
			}
		}
		
		const cognitoUser = getCognitoUser(form.email)
		const authDetails = new AuthenticationDetails({ Username: form.email, Password: form.password })
		cognitoUser.authenticateUser(authDetails, {
			onSuccess: onAuthenticateAwsSuccess,
			onFailure: (e) => {
				onAuthenticateFailure?.(e, cognitoUser)
				loading.value = false
			},
		})
	}
	
	return {
		login: handleLogin,
		fetching: computed(() => fetching.value || loading.value),
	}
}
