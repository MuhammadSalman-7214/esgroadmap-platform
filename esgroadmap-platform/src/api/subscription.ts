import { AxiosError } from 'axios'
import router from './router'

const cancel = async () => {
  try {
    const response = await router.private.get('/subscription/cancel')
    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error)
    }
    throw new Error('Cancel subscription failed')
  }
}

const subscription = { cancel }

export default subscription;
