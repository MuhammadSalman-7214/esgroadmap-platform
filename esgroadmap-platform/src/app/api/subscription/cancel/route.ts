import prisma from '@/lib/prisma'
import stripe from '@/lib/stripe'
import authorizer from '@/server/middleware/authorizer'
import handleError from '@/utils/handle-error'
import { HttpStatusCode } from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { user } = await authorizer()

    if (user.plan !== 2) {
      throw new Error('Cannot cancel subscription')
    }

    const userSubscription = await prisma.userSubscription.findFirst({
      where: { deletedAt: null, userId: user.id },
    })

    if (!userSubscription) {
      throw new Error('User isn\'t subscribed')
    }

    await Promise.all([
      prisma.user.update({ where: { id: user.id }, data: { plan: 1 } }),
      prisma.userSubscription.delete({ where: { id: userSubscription.id } }),
      stripe.subscriptions.cancel(userSubscription.subscriptionId),
    ])

    return NextResponse.json(
      {
        data: {},
        success: true,
        error: null,
        message: 'Subscription cancelled successfully!'
      },
      {
        status: HttpStatusCode.Ok,
      },
    )
  } catch (error) {
    return handleError(error)
  }
}
