// /src/app/api/webhook/paypal/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import axios from 'axios';
import env from '@/config/env.config';
import prisma from '@/lib/prisma';


const PAYPAL_BASE = 'https://api-m.sandbox.paypal.com';

async function verifyWebhookSignature(reqBody: any, signature: string, transmissionId: string, timestamp: string, certUrl: string, authAlgo: string) {
  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature_post
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET_KEY}`).toString('base64');
  const res = await axios.post(
    `${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`,
    {

      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: signature,
      transmission_time: timestamp,
      webhook_id: env.PAYPAL_WEBHOOK_ID,
      webhook_event: reqBody,

    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.verification_status === 'SUCCESS';
}

export async function POST(request: Request) {
  try {
    const sig = headers().get('paypal-transmission-sig');
    const transmissionId = headers().get('paypal-transmission-id');
    const timestamp = headers().get('paypal-transmission-time');
    const certUrl = headers().get('paypal-cert-url');
    const authAlgo = headers().get('paypal-auth-algo');

    if (!sig || !transmissionId || !timestamp || !certUrl || !authAlgo) {
      return NextResponse.json({ error: 'Invalid webhook headers' }, { status: 400 });
    }

    const body = await request.json();

    // Optionally verify the signature
    const isValid = await verifyWebhookSignature(
      body, sig, transmissionId, timestamp, certUrl, authAlgo
    );
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const eventType = body.event_type;
    const subscriptionId = body.resource?.id || body.resource?.billing_agreement_id;

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Mark the user’s subscription as active, set plan=2 if free trial or subscription started
        // nice to have a status field in the userSubscription table, don't have it now
        // await prisma.userSubscription.update({
        //   where: { subscriptionId: subscriptionId as string },
        //   data: { status: 'active' },
        // });
        // Also update user plan


        await prisma.user.update({
          where: { id: /* get userId from userSubscription table */ 1 },
          data: { plan: 2 },
        });
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Mark subscription as cancelled, user’s plan = 1, etc.
        // nice to have a status field in the userSubscription table, don't have it now
        // await prisma.userSubscription.update({
        //   where: { subscriptionId: subscriptionId as string },
        //   data: { status: 'cancelled' },
        // });

        // Also update user plan

        await prisma.user.update({
          where: { id: /* get userId from userSubscription table */ 1 },
          data: { plan: 1 },
        });
        break;

      case 'PAYMENT.SALE.COMPLETED':
        // Payment success for monthly renewal
        // e.g., store invoice details, confirm no action is needed unless you want to send an email, etc.
        break;

      default:
        console.log('Unhandled PayPal webhook event:', eventType);
        break;
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
