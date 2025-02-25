import { AxiosError } from 'axios'
import router from './router'

type SavePortfolioPayload = {
  name: string;
  filters: object;
  tableName: string;
}

const save = async (body: SavePortfolioPayload) => {
  try {
    const response = await router.private.post('/portfolio', body)
    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return 'Filters Saved Successfully';
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error)
    }
    throw new Error('Filters Save Failed')
  }
}

export type Portfolio = {
  id: number;
  name: string;
  filters: object;
  tableName: string;
  createdAt: Date;
}

const list = async (query: { tableName?: string }) => {
  try {
    let queryString = []
    if (query.tableName) {
      queryString.push(`tableName=${query.tableName}`)
    }

    const url = `/portfolio?${queryString.join('&')}`

    const response = await router.private.get(url)
    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as Array<Portfolio>
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error)
    }
    throw new Error('Cannot fetch portfolios')
  }
}

const portfolio = { save, list }

export default portfolio;
