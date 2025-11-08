# LaundryDash Web Workspace

React + TypeScript + Vite app that powers the LaundryDash landing page selector and the mobile-friendly driver workflow prototype.

## Available experiences

- `/` – role selection home. Choose Customer or Driver experience.
- `/driver` – fully designed driver cockpit with online toggle, job intake, route timeline, proof-of-service actions, performance dashboard, and surge alerts.
- `/customer` – complete customer mobile app with service selection, scheduling, order tracking, and profile management.

## Customer App Features

The customer experience includes:

- **Home Tab**: Browse and select laundry services (Wash & Fold, Dry Clean, Premium Care, Express)
- **Schedule Pickup**: Set address, date, time, and special instructions
- **Track Order**: Real-time order status with 6-stage progress timeline, driver info, and live map
- **Order History**: View past orders with re-order capability
- **Profile**: Manage saved addresses, payment methods, and preferences

## Driver App Features

The driver experience includes:

- **Active Jobs**: Multi-job management with 7-stage workflow progression
- **New Requests**: Accept/reject incoming jobs with countdown timer
- **Job Board**: Overview of all active, queued, and completed jobs
- **Dashboard**: Earnings tracking, performance metrics, and surge alerts

## Getting started

```bash
cd laundrydash-app
npm install
npm run dev        # local dev server
npm run build      # production build (used by Vercel)
```

## Tech stack

- React 18 + TypeScript
- Vite for build/dev server
- React Router for navigation between home, driver, and customer placeholders
- Hand-crafted CSS optimized for 375–428px mobile widths and responsive on desktop

Deployments (e.g., Vercel) should point to the `laundrydash-app` folder and run `npm run build`.
