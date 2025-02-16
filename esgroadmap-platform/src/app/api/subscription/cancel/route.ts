// file: /src/app/api/subscription/cancel/route.ts
import prisma from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { getPayPalAccessToken, PAYPAL_API } from '@/lib/paypal';
import authorizer from '@/server/middleware/authorizer';
import { NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

export async function POST() {
  try {
    const { user } = await authorizer();
    // 1) Find user’s subscription in your DB
    const userSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!userSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found for this user.' },
        { status: 400 }
      );
    }

    const subscriptionId = userSubscription.subscriptionId;

    // 2) Detect if subscription is Stripe vs PayPal
    if (subscriptionId.startsWith('sub_')) {
      // STRIPE
      await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Assume it's PayPal
      const accessToken = await getPayPalAccessToken();
      await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason: 'User-initiated cancellation' }),
      });
    }

    // 3) Update DB: set plan=1, mark subscription as deleted
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { plan: 1 },
      }),
      prisma.userSubscription.update({
        where: { id: userSubscription.id },
        data: { deletedAt: new Date() },
      }),
    ]);

    return NextResponse.json(
      { success: true, message: 'Subscription cancelled successfully!' },
      { status: HttpStatusCode.Ok }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
