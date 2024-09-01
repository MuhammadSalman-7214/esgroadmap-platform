import axios from 'axios'
import Cookies from 'js-cookie'

const publicRouter = axios.create({
  baseURL:
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
})

const privateRouter = axios.create({
  baseURL:
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
})

privateRouter.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const router = {
  public: publicRouter,
  private: privateRouter,
}

export default router
