import { z } from 'zod'

const createPortfolio = z.object({
  name: z.string(),
  filters: z.any(),
  tableName: z.string(),
})

export type CreatePortfolio = z.infer<typeof createPortfolio>

const portfolioValidator = {
  createPortfolio,
}

export default portfolioValidator
