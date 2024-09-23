import { GetUserProfile, GetUserProfileVariables } from '@/graphql/generated'
import { CombinedError } from '@urql/vue'
import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'

export const getUserPool = () => {
  const CONFIG_COGNITO_POOL = {
    UserPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
    ClientId: import.meta.env.VITE_CONGNITO_CLIENT_ID,
    // IdentityPoolId: '1',
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

// cognito session from jwt
export const createCognitoSessionFromJWT = ({
  idTokenJWT,
  accessTokenJWT,
  refreshTokenJWT,
}: {
  idTokenJWT: string
  accessTokenJWT: string
  refreshTokenJWT?: string
}) => {
  const idToken = new CognitoIdToken({ IdToken: idTokenJWT })
  const accessToken = new CognitoAccessToken({ AccessToken: accessTokenJWT })
  const refreshToken = refreshTokenJWT
    ? new CognitoRefreshToken({ RefreshToken: refreshTokenJWT })
    : undefined

  const session = new CognitoUserSession({
    AccessToken: accessToken,
    IdToken: idToken,
    RefreshToken: refreshToken,
  })

  return session
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

// used to get saved tokens in localstorage
const getCognitoLocalStorage = () => {
  let refreshToken = null
  let accessToken = null
  let idToken = null

  for (const key in localStorage) {
    if (key.startsWith('CognitoIdentityServiceProvider.')) {
      if (key.endsWith('.accessToken')) {
        accessToken = localStorage.getItem(key)
      } else if (key.endsWith('.idToken')) {
        idToken = localStorage.getItem(key)
      } else if (key.endsWith('.refreshToken')) {
        refreshToken = localStorage.getItem(key)
      }
    }
  }

  if (accessToken && idToken) {
    return {
      accessToken,
      idToken,
      refreshToken,
    }
  }

  return null
}

export const clearLocalStorageTokens = () => {
  const whiteListKeys = ['Starpx.theme', 'Starpx.lang', 'upload']

  for (const key in localStorage) {
    if (!whiteListKeys.includes(key)) {
      localStorage.removeItem(key)
    }
  }
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

export function useCognito() {
  const sessionStore = useSessionStore()
  const uiStore = useUiStore()
  const { JWTtokens } = storeToRefs(sessionStore)

  // get & set tokens when app initialize
  const { client } = useApiClient()
  const routeSessionStart = async ({ onExpired }: { onExpired: () => void }) => {

    const expiredCb = () => {
      clearLocalStorageTokens()
      uiStore.addToast({
        type: 'error',
        message: 'Token expired',
      })
      onExpired()
    }

    const res = await getRefreshCognitoSession()
    if (res === false) expiredCb()

    if (!JWTtokens.value) return

    try {
      const { data: profileData, error: profileError } = await client.value.query<
        GetUserProfile,
        GetUserProfileVariables
      >(GetUserProfileDocument, {})

      if (profileError || !profileData?.getUserProfile) throw profileError

      sessionStore.setUser(profileData.getUserProfile)
    } catch (error) {
      uiStore.addToast({
        type: 'error',
        message: verboseUrqlError(error as CombinedError),
      })

      sessionStore.logout({ autoRedirectToLogin: true })
    }
  }

  return {
    routeSessionStart,
  }
}
