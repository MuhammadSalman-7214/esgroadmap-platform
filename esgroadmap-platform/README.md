This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setting up on local environment

Step 1: In order to first run the project, Please clone the repo using git
git clone <repo-url>

Step 2: Install all packages using pnpm, if you don't have npm run this command (npm i -g pnpm)
pnpm install

Step 3: Create a .env file in the root of your project

DATABASE_URL="mysql://admin:hassanarshad1122@esgroadmap.cwco2pchjykw.us-east-2.rds.amazonaws.com:3306/esgroadmap?schema=public"

JWT_ACCESS_TOKEN_SECRET=abcd1234
JWT_ACCESS_TOKEN_EXPIRY=365d

API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api

STRIPE_PUBLISHABLE_KEY=pk_test_51M9E7JHISpnSlXUl05fBbd3PDx8Md9xpOH5RE5h4721TPWp0RPHUPsaIs9F4JlLO3hkLCTRAX49RO7QwMSaE0Rjk005EdVLxt2
STRIPE_SECRET_KEY=sk_test_51M9E7JHISpnSlXUlKEW3BwZvoFs0Fe6nOYMPdRDHhYdOLUje7vnP4Tsyn3nHyZcOjPuOCk02kbkPDIjDLK7EP4fN00AYbE4xVp
STRIPE_WEBHOOK_SECRET=whsec_a4409cd7462b28f2e1ecbdc8ea1a97b2eb2e1c5500ca48900f5f5e6dfde991c4
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_aEU2ce0xu2Wn3sI288

Paste these things inside the .env file

Step 4: Run the project with pnpm run dev


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
