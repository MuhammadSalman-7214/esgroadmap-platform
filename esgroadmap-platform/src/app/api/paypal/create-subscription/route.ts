// /src/app/api/paypal/create-subscription/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import env from '@/config/env.config';
import prisma from '@/lib/prisma';


const PAYPAL_BASE = 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET_KEY}`).toString('base64');
  const res = await axios({
    method: 'post',
    url: `${PAYPAL_BASE}/v1/oauth2/token`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
    data: 'grant_type=client_credentials'
  });
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json(); // e.g. pass userId from front-end
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Optionally verify the user exists in your DB
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const accessToken = await getAccessToken();

    // Create subscription
    const subPayload = {
      plan_id: 'P-6UT44094GJ279232YM6RF5QA',
      subscriber: {
        name: { given_name: user.username || 'NoName' },

        email_address: user.email,
      },
      application_context: {
        return_url: 'https://YOUR_DOMAIN/paypal/return', // handle success
        cancel_url: 'https://YOUR_DOMAIN/paypal/cancel', // handle cancel
      },
    };

    const res = await axios.post(
      `${PAYPAL_BASE}/v1/billing/subscriptions`,
      subPayload,
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    const subscription = res.data;
    // subscription.links usually includes an approval_url or href you can redirect to
    const approveLink = subscription.links?.find((link: any) => link.rel === 'approve')?.href;

    // Keep track of the subscription in your DB with a status = "PENDING" (until PayPal confirms)
    // but do NOT mark the user plan = 2 yet.
    await prisma.userSubscription.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
      },
    });


    return NextResponse.json({
      subscriptionId: subscription.id,
      approveLink,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
