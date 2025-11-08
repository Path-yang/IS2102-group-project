# IS2102-group-project

This repo now hosts:

- `/pdf` – all source project specification files (kept locally, ignored from git).
- `/laundrydash-app` – Vite + React workspace for the LaundryDash web/mobile prototype.

## Running the driver prototype

```bash
cd laundrydash-app
npm install
npm run dev
```

Visit `http://localhost:5173`:

- Landing page lets you choose Customer (placeholder) or Driver.
- Driver experience is optimized for mobile portrait width and covers job intake, routing, proof-of-pickup/delivery, communication shortcuts, earnings dashboard, and surge alerts as outlined in the driver PDFs.

Use `npm run build` before deploying to Vercel to ensure the bundle is production-ready.
