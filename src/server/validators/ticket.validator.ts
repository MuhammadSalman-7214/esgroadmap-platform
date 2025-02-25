import { z } from 'zod'

const createTicket = z.object({
  title: z.string(),
  description: z.string(),
  documents: z.array(
    z.object({
      url: z.string(),
      name: z.string(),
      size: z.number(),
    }),
  ),
})

const addComment = z.object({
  text: z.string(),
})

export type CreateTicket = z.infer<typeof createTicket>
export type AddCommentSchema = z.infer<typeof addComment>

const ticketValidator = {
  createTicket,
  addComment
}

export default ticketValidator
