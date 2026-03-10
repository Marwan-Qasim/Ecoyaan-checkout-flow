# Ecoyaan Checkout Flow (Assignment MVP)

This project is a simplified checkout flow built with Next.js App Router.

## Stack

- React + Next.js (App Router)
- Server Components for SSR data fetching
- Context API for checkout state (shipping address)
- Plain CSS for responsive UI

## Flow Implemented

1. `GET /` - Cart / Order Summary
2. `GET /checkout` - Shipping Address form + validation
3. `GET /payment` - Final confirmation + simulated payment
4. `GET /success` - Order success state

## SSR Requirement

Cart data is fetched asynchronously on the server in:

- `src/app/page.jsx`
- `src/app/payment/page.jsx`

using `getCartData()` from `src/lib/cartService.js`. Both pages use:

```js
export const dynamic = "force-dynamic";
```

to ensure server-side rendering on each request.

## State Management

`src/app/providers.jsx` defines a `CheckoutProvider` with Context API to persist shipping address across route transitions.

- Address is stored in React state
- Synced to `localStorage` for refresh resilience

## Form Validation

The shipping form validates:

- required fields
- email format
- 10-digit phone number
- 6-digit PIN code

## Run Locally

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
cd client
npm run build
npm start
```

## Deployment

Deploy to Vercel or Netlify.

- Vercel: import repository and set root directory to `client`
- Netlify: set build command `npm run build` and publish directory `.next`
