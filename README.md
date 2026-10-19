# Infinity Institute of Technology

Course-selling website built with React, TypeScript, Vite, and Tailwind CSS.

## Requirements

- Node.js 22.12 or newer, or Node.js 20.19.x
- pnpm 10.34.3, pinned in `package.json`

The repository includes `.mise.toml` for installing the recommended Node.js and pnpm versions with mise.

## Run locally

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:8443>. Vite uses port 8443 by default and requires the port to be available. Set `PORT` to use a different port.

## Checks and production preview

```powershell
pnpm typecheck
pnpm build
pnpm preview
```

The payment UI can be explored locally. Completing Razorpay purchases requires the corresponding Supabase Edge Function and Razorpay server configuration. Set the `CHATGPT_ACCESS_URL`, `VIDEO_EDITING_ACCESS_URL`, and `DIGITAL_MARKETING_ACCESS_URL` Edge Function secrets to the shareable course folder URLs to return those links after verified payment. UPI payment details are configured in `src/config/payment.ts`.
