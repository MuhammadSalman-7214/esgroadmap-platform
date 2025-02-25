import { NextResponse } from 'next/server';
import env from '@/config/env.config';
import axios from 'axios';

const PAYPAL_BASE = 'https://api-m.sandbox.paypal.com'; // sandbox base URL

async function getAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET_KEY}`).toString('base64');
  const res = await axios({
    method: 'post',
    url: `${PAYPAL_BASE}/v1/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    data: 'grant_type=client_credentials',
  });
  return res.data.access_token;
}

export async function GET() {
  try {
    // 1) Get OAuth token
    const accessToken = await getAccessToken();

    // 2) Provide a valid product_id from your PayPal dashboard:
    const planPayload = {
      product_id: 'PROD-81A317568N800882Y', // Replace with actual Product ID
      name: 'Monthly Plan with 30-day Free Trial',
      description: 'Membership subscription, $20/month after free trial.',
      billing_cycles: [
        {
          frequency: { interval_unit: 'DAY', interval_count: 30 },
          tenure_type: 'TRIAL',
          sequence: 1,
          total_cycles: 1,
          pricing_scheme: {
            fixed_price: { value: '0', currency_code: 'USD' },
          },
        },
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 2,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: '20', currency_code: 'USD' },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CANCEL',
        payment_failure_threshold: 3,
      },
    };

    // 3) Create plan
    const response = await axios.post(
      `${PAYPAL_BASE}/v1/billing/plans`,
      planPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const createdPlan = response.data;
    console.log('Plan created successfully:', createdPlan);
    return NextResponse.json(createdPlan);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
