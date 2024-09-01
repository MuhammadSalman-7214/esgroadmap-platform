import { TicketStatus } from '@/constants/status'
import { HttpConflictError, HttpNotFoundError } from '@/errors'
import prisma from '@/lib/prisma'
import authorizer from '@/server/middleware/authorizer'
import ticketValidator, {
  AddCommentSchema,
  CreateTicket,
} from '@/server/validators/ticket.validator'
import handleError from '@/utils/handle-error'
import validate from '@/utils/validate'
import { Prisma, User } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const json = await request.json()
    const { user, payload } = await authorizer()
    const body = await validate<AddCommentSchema>(
      ticketValidator.addComment,
      json,
    )

    const ticket = await getTicketById(Number(params.id), user)

    const comment = await prisma.ticketComment.create({
      data: {
        text: body.text,
        ticketId: ticket.id,
        userId: user.id,
      },
    })

    revalidateTag(`ticket-${ticket.id}-comments`)

    return NextResponse.json(
      { data: comment, error: null, success: true },
      { status: HttpStatusCode.Created },
    )
  } catch (error) {
    return handleError(error)
  }
}

const getTicketById = async (id: number, user: Omit<User, 'password'>) => {
  const where: Prisma.TicketWhereInput = {
    id,
  }
  if (user.role === 'user') {
    where.userId = user.id
  }
  const ticket = await prisma.ticket.findFirst({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      postedBy: { select: { id: true, username: true } },
      documents: {
        select: { id: true, url: true, size: true, name: true },
      },
      createdAt: true,
      status: true,
    },
  })
  if (!ticket) throw new HttpNotFoundError('Ticket not found!')

  return ticket
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { user, payload } = await authorizer()
    const where: Prisma.TicketWhereInput = {}
    if (user.role === 'user') {
      where.userId = user.id
    }

    const ticket = await getTicketById(Number(params.id), user)

    const comments = await prisma.ticketComment.findMany({
      where: { ticketId: ticket.id },
      select: {
        id: true,
        text: true,
        postedBy: { select: { id: true, username: true } },
        createdAt: true,
      },
    })

    return NextResponse.json(
      { data: comments, error: null, success: true },
      { status: HttpStatusCode.Ok },
    )
  } catch (error) {
    console.log({ error })
    return handleError(error)
  }
}
