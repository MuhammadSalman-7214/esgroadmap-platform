export const publicRoutes = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/membership-account/membership-checkout',
  '/auth/membership-account/membership-levels',
  '/auth/lost-password',
  '/images',
  '/_next/static',
  '/api',
]

export const freePlanRoutes = [
  { route: '/dashboard', exact: true },
  { route: '/dashboard/targets/carbon-reduction', exact: true },
  { route: '/dashboard/tickets', exact: false },
  { route: '/dashboard/account', exact: true },
  { route: '/dashboard/faqs', exact: true },
]
