# LaundryDash Web Workspace

React + TypeScript + Vite app that powers the LaundryDash landing page selector and the mobile-friendly driver workflow prototype.

## Available experiences

- `/` – role selection home. Choose Customer (placeholder for now) or Driver.
- `/driver` – fully designed driver cockpit with online toggle, job intake, route timeline, proof-of-service actions, performance dashboard, and surge alerts tailored to the PDF requirements.
- `/customer` – blank scaffold to be expanded in the next sprint.

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
