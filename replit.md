# Build With Clark

A professional web design services landing page for Jason Clark targeting small businesses and everyday people who need websites — built to share on KSL and Facebook Marketplace.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/build-with-clark/src/`
  - Pages: `Home.tsx`, `Packages.tsx`, `CheckoutSuccess.tsx`, `CheckoutCancel.tsx`
  - Components: `PreviewGenerator.tsx`, `HeroScene.tsx`, `TechGlobe.tsx`
- API routes: `artifacts/api-server/src/routes/`
  - `preview-generator.ts` — AI page preview (OpenAI)
  - `download.ts` — HTML page export (`/api/generate-page`)
  - `stripe.ts` — Packages catalog + checkout (`/api/packages-with-prices`, `/api/checkout`)
  - `contact.ts` — Contact form submissions
- Stripe: `artifacts/api-server/src/stripeClient.ts`, `stripeService.ts`, `storage.ts`, `webhookHandlers.ts`
- DB schema: `lib/db/src/schema/` — `contacts.ts`, `users.ts`
- Seed script: `scripts/src/seed-products.ts`

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

- **Landing page** with hero, how-it-works, value prop, capabilities (3D globe), AI preview generator, about, and contact form
- **AI live demo**: visitors type their business name → AI generates a real mini preview → they can download it as a standalone HTML file (`/api/generate-page`)
- **Packages catalog** (`/packages`): 3 one-time site builds + 3 monthly webmaster retainer plans, purchasable via Stripe Checkout
- **Stripe payments**: fully integrated with webhooks, backfill sync, and checkout sessions

## Stripe Activation Steps

After connecting Stripe in the Integrations tab:
1. Run `pnpm --filter @workspace/scripts run seed-products` to create the 6 packages in Stripe
2. Restart the API server workflow — it will sync products and configure webhooks automatically
3. The `/packages` page will populate with real pricing cards and working Buy buttons

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
