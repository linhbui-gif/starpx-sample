import { CombinedError } from '@urql/vue'

export const verboseUrqlError = (error: CombinedError | undefined) => {
  if (!error) return 'Something went wrong'

  if (error.networkError) {
    return error.networkError.message
  }

  try {
    const qlError = error.graphQLErrors[0]
    return qlError.message
  } catch {
    return error.message
  }
}
