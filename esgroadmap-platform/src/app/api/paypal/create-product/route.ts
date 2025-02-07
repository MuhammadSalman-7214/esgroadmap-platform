import { NextResponse } from 'next/server';
import axios from 'axios';
import env from '@/config/env.config';

const PAYPAL_BASE = 'https://api-m.sandbox.paypal.com'; // Production => 'https://api-m.paypal.com'

async function getAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET_KEY}`).toString('base64');
  const { data } = await axios({
    method: 'post',
    url: `${PAYPAL_BASE}/v1/oauth2/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    data: 'grant_type=client_credentials',
  });
  return data.access_token;
}

export async function POST() {
  try {
    const accessToken = await getAccessToken();

    // Define your product payload
    const productPayload = {
      name: 'ESG Roadmap Membership', // must be unique among your products
      type: 'SERVICE',               // or DIGITAL / PHYSICAL
      category: 'SOFTWARE',          // or a valid category from docs
      description: 'ESG membership product: monthly subscription with free trial',
    //   home_url: 'https://esgroadmap.com', // optional
    };

    const { data: createdProduct } = await axios.post(
      `${PAYPAL_BASE}/v1/catalogs/products`,
      productPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Product created successfully:', createdProduct);
    return NextResponse.json(createdProduct);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
