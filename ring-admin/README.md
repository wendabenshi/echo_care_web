# Ring Admin

Small internal tool for the current NFC ring flow.

What it does:

- takes an NFC UUID
- generates a signed URL like `https://echo-care-web.vercel.app/ring?uid=UUID&sig=...`
- keeps a legacy `?token=UUID` fallback URL for compatibility
- stores the signed link history in the browser
- protects link signing behind an admin key
- keeps a copyable fallback SQL snippet for the old `page_tokens` table
- stores a local history in the browser
- exports history as CSV or JSON

## Run locally

From the project root:

```bash
cd ring-admin
npm run dev
```

If you want a fresh install just for this subproject:

```bash
cd ring-admin
npm install
npm run dev
```

## Why this project is separate

`echo_care_web` is the customer-facing experience.

`ring-admin` is your internal production tool, so it stays separate to avoid mixing admin flows into the public tarot app.

## Required server environment

The signing API needs these Vercel environment variables:

- `RING_SIGNING_SECRET`
- `RING_ADMIN_KEY`
- `PUBLIC_APP_URL`
