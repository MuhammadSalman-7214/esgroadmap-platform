import { Ticket, TicketDocument, User } from '@prisma/client'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import router from './router'
import { z } from 'zod'
import { createTicketSchema } from '@/lib/schema'
import { revalidateTag } from 'next/cache'

export type SupportTicket = Pick<
  Ticket,
  'id' | 'title' | 'description' | 'status' | 'createdAt'
> & {
  postedBy: Pick<User, 'id' | 'username'>
  documents: Array<Pick<TicketDocument, 'id' | 'url' | 'size' | 'name'>>
}

export type SupportTicketDocument = {
  url: string
  size: number
  name: string
}

export type SupportTicketComment = {
  id: number
  text: string
  postedBy: Pick<User, 'id' | 'username'>
  createdAt: Date
}

const list = async (options: { accessToken: string }) => {
  try {
    const response = await router.public.get(`/tickets`, {
      headers: { Authorization: `Bearer ${options?.accessToken}` },
    })

    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as Array<SupportTicket>
  } catch (error) {
    console.log({ error })
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error)
    }
    throw new Error('Cannot get data')
  }
}

const getById = async (id: string, options: { accessToken: string }) => {
  try {
    const response = await router.public.get(`/tickets/details/${id}`, {
      headers: { Authorization: `Bearer ${options?.accessToken}` },
    })

    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as SupportTicket
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error('Cannot get data')
  }
}

const uploadDocuments = async (files: File[]) => {
  try {
    const body = new FormData()

    for (const file of files) {
      body.append('files', file)
    }

    const response = await router.private.post(`/tickets/upload`, body)

    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as SupportTicketDocument[]
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error)
    }
    console.log(error)
    throw new Error('Cannot upload document')
  }
}

const create = async (
  body: z.infer<typeof createTicketSchema> & {
    documents: SupportTicketDocument[]
  },
) => {
  try {
    const response = await router.private.post(`/tickets`, body)
    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as SupportTicket
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error)
    }
    throw new Error('Cannot create ticket')
  }
}

const addComment = async (id: number, text: string) => {
  try {
    const response = await router.private.post(`/tickets/comment/${id}`, {
      text,
    })
    if (!response.data.success) {
      throw new Error(response.data.error ?? '')
    }
    return response.data.data as SupportTicketComment
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error)
    }
    throw new Error('Cannot add comment')
  }
}

const listComments = async (id: number, options?: { accessToken?: string }) => {
  try {
    let data: any
    if (options?.accessToken) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
          next: { revalidate: 60, tags: [`ticket-${id}-comments`], },
        },
      )

      data = (await res.json()).data;
    } else {
      const response = await router.private.get(`/tickets/comment/${id}`)
      if (!response.data.success) {
        throw new Error(response.data.error ?? '')
      }
      data = response.data.data
    }
    return data as SupportTicketComment[]
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error)
    }
    throw new Error('Cannot list comments')
  }
}

const ticket = {
  getById,
  list,
  uploadDocuments,
  create,
  addComment,
  listComments,
}

export default ticket
