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

### Deployment note

`vercel.json` is configured so Vercel builds from the `laundrydash-app` subdirectory (via `@vercel/static-build`) and rewrites every route to `index.html`, preventing SPA deep-link 404s. No extra setup needed—just push to `main` and redeploy.
