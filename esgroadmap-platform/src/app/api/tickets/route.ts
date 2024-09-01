import { TicketStatus } from '@/constants/status'
import { HttpConflictError } from '@/errors'
import prisma from '@/lib/prisma'
import authorizer from '@/server/middleware/authorizer'
import ticketValidator, {
  CreateTicket,
} from '@/server/validators/ticket.validator'
import handleError from '@/utils/handle-error'
import validate from '@/utils/validate'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { user, payload } = await authorizer()
    const body = await validate<CreateTicket>(
      ticketValidator.createTicket,
      json,
    )

    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        description: body.description,
        status: TicketStatus.Open,
        userId: user.id,
      },
    })

    if (body.documents.length > 0) {
      await prisma.ticketDocument.createMany({
        data: body.documents.map((doc) => {
          return {
            url: doc.url,
            size: doc.size,
            name: doc.name,
            ticketId: ticket.id,
          }
        }),
      })
    }

    const newTicket = await prisma.ticket.findFirst({
      where: { id: ticket.id },
      select: {
        id: true,
        title: true,
        description: true,
        postedBy: { select: { id: true, username: true } },
        documents: {
          select: { id: true, url: true },
        },
        createdAt: true,
      },
    })

    return NextResponse.json(
      { data: newTicket, error: null, success: true },
      { status: HttpStatusCode.Created },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function GET(request: Request) {
  try {
    const { user, payload } = await authorizer()
    const where: Prisma.TicketWhereInput = {}
    if (user.role === 'user') {
      where.userId = user.id
    }
    const tickets = await prisma.ticket.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        postedBy: { select: { id: true, username: true } },
        documents: {
          select: { id: true, url: true },
        },
        createdAt: true,
      },
    })

    return NextResponse.json(
      { data: tickets, error: null, success: true },
      { status: HttpStatusCode.Ok },
    )
  } catch (error) {
    console.log({ error })
    return handleError(error)
  }
}
