import { TicketStatus } from '@/constants/status'
import { HttpConflictError, HttpNotFoundError } from '@/errors'
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (isNaN(parseInt(params.id))) {
      throw new Error('not a valid id');
    }

    const { user, payload } = await authorizer()
    const where: Prisma.TicketWhereInput = {
      id: Number(params.id),
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

    if (!ticket) {
      throw new HttpNotFoundError('ticket not found!');
    }

    return NextResponse.json(
      { data: ticket, error: null, success: true },
      { status: HttpStatusCode.Ok },
    )
  } catch (error) {
    return handleError(error)
  }
}
