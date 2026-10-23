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

The payment UI uses direct UPI payments. Customers pay through their UPI app and send the payment screenshot on WhatsApp for manual verification. UPI payment details are configured in `src/config/payment.ts`.
