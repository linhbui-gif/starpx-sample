import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserPool, CognitoUserSession,
} from 'amazon-cognito-identity-js'

export const getUserPool = () => {
	const CONFIG_COGNITO_POOL = {
		UserPoolId: 'us-east-1_MPLMPbOrn',
		ClientId: '7pk53f021pnn8qrr3lut7m3qgm',
	}
	
	return new CognitoUserPool(CONFIG_COGNITO_POOL)
}

export const getCognitoUser = (username: string) => {
	const userPool = getUserPool()
	
	return new CognitoUser({
		Username: username,
		Pool: userPool,
	})
}
export const getRefreshCognitoSession = async (): Promise<boolean | undefined> => {
	// native cognito way
	const userPool = getUserPool()
	const cognitoUser = userPool.getCurrentUser()
	if (!cognitoUser) return
	
	// will trigger refresh if needed
	const res: boolean = await new Promise((resolve, reject) => {
		cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
			if (err) {
				resolve(false)
				return
			} else if (session?.isValid()) {
				const tokens = getJWTfromCognitoSession(session)
				useSessionStore().setJWTTokens(tokens)
			}
			
			resolve(true)
		})
	})
	
	return res
}

export const getJWTfromCognitoSession = (session: CognitoUserSession) => {
	const accessJWT = session.getAccessToken().getJwtToken()
	const idJWT = session.getIdToken().getJwtToken()
	let refreshJWT = null
	
	try {
		refreshJWT = session.getRefreshToken().getToken()
	} catch {
		//
	}
	
	return {
		id: idJWT,
		access: accessJWT,
		refresh: refreshJWT,
	}
}

export const clearLocalStorageTokens = () => {
	const whiteListKeys = ['Starpx.theme', 'Starpx.lang', 'upload']
	
	for (const key in localStorage) {
		if (!whiteListKeys.includes(key)) {
			localStorage.removeItem(key)
		}
	}
}
export function useAuth(formData: { email: string; password: string }) {
	const errorMessage = ref<string>('');
	const isLoading = ref<boolean>(false);
	const isLoggedIn = ref(false)
	const router = useRouter()
	const uiStore = useUiStore()
	const login = () => {
		if (isLoading.value || isLoggedIn.value) {
			return
		}
		isLoading.value = true;
		const cognitoUser = getCognitoUser(formData.email)

		const authenticationDetails = new AuthenticationDetails({
			Username: formData.email,
			Password: formData.password,
		});

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => {
				isLoading.value = false;
				isLoggedIn.value = true
				localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
				localStorage.setItem('refreshToken', result.getRefreshToken().getToken());
				uiStore.addToast({
					type: 'success',
					message: 'Login successfully !',
				})
				router.push('/')
			},
			onFailure: (err) => {
				isLoading.value = false;
				handleAuthError(err, cognitoUser)
			},
		});
	};
	const handleAuthError = (err: any, cognitoUser: CognitoUser) => {
		if (err.code === 'NotAuthorizedException' || err.code === 'UserNotFoundException') {
			errorMessage.value = 'Email hoặc mật khẩu không chính xác.'
			uiStore.addToast({
				type: 'error',
				message: errorMessage.value,
			})
		} else if (err.code === 'AccessTokenExpired') {
			errorMessage.value = 'Token đã hết hạn. Vui lòng đăng nhập lại.'
			uiStore.addToast({
				type: 'error',
				message: errorMessage.value,
			})
			cognitoUser.signOut()
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			router.push('/login');
		} else {
			errorMessage.value = err.message || JSON.stringify(err)
		}
	}
	
	const refreshSession = async () => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			return;
		}
		
		const cognitoUser = getCognitoUser(formData.email);
		cognitoUser.refreshSession(refreshToken, (err, session) => {
			if (err) {
				console.error('Error refreshing session:', err);
				return;
			}
			localStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
		});
	};
	return {
		errorMessage,
		isLoading,
		login,
	};
}