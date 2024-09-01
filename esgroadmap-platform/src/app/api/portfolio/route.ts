import prisma from '@/lib/prisma'
import authorizer from '@/server/middleware/authorizer'
import handleError from '@/utils/handle-error'
import portfolioValidator, { type CreatePortfolio } from '@/server/validators/portfolio.validator'

import validate from '@/utils/validate'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { user } = await authorizer()
    const body = await validate<CreatePortfolio>(
      portfolioValidator.createPortfolio,
      json,
    )

    const portfolio = await prisma.portfolio.create({
      data: {
        name: body.name,
        filters: body.filters as Prisma.JsonObject,
        userId: user.id,
        tableName: body.tableName
      },
    })

    return NextResponse.json(
      { data: portfolio, error: null, success: true },
      { status: HttpStatusCode.Created },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tableName = searchParams.get('tableName') ?? 'carbon_reduction'
    const { user } = await authorizer()
    const where: Prisma.PortfolioWhereInput = {
      tableName
    }
    if (user.role === 'user') {
      where.userId = user.id
    }
    const data = await prisma.portfolio.findMany({
      where,
      select: {
        id: true,
        name: true,
        filters: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { data, error: null, success: true },
      { status: HttpStatusCode.Ok },
    )
  } catch (error) {
    console.log({ error })
    return handleError(error)
  }
}
