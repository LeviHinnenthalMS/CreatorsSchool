# Setup

The fastest path is to open this repo in Claude Code and run `/setup` — it walks you through every step interactively. If you'd rather do it by hand, follow this checklist.

## Prerequisites

- Node 22.12+ (`.nvmrc` says 20 but `package.json` engines requires 22+ — use 22)
- pnpm
- A Sanity account (free) — https://sanity.io
- Optional: Vercel account if you'll deploy

## Steps

1. **Rename** — in `package.json` (`name`, `description`), `sanity.config.ts` (`title`), `src/app/(frontend)/layout.tsx` (default metadata), `README.md`.

2. **Install** — `pnpm install`.

3. **Sanity project** — pick one:
   - Existing: get `projectId` + `dataset` from https://sanity.io/manage.
   - New: run `npx sanity init --bare` (interactive, opens browser).

4. **Tokens** — at https://sanity.io/manage → your project → API → Tokens, create:
   - A **Viewer** token (for `SANITY_API_READ_TOKEN`)
   - An **Editor** token (for `SANITY_API_WRITE_TOKEN`, only needed for seeding — revoke after)

5. **.env.local** — copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`
   - `SANITY_REVALIDATE_SECRET` — `openssl rand -hex 32`
   - `NEXT_PUBLIC_BASE_URL` (optional, e.g. `http://localhost:3000` for dev)

6. **Seed** — `pnpm seed`. Creates the `site` singleton + a `home` page per language in `src/lib/i18n.ts`. Idempotent.

7. **Vercel** (optional) — `vercel link`, then `vercel env pull .env.local` to sync env from Vercel.

8. **Verify**:
   ```
   pnpm typecheck
   pnpm dev
   ```
   Open http://localhost:3000 (site) and http://localhost:3000/admin (Studio).

## Adding a language

Add to `supportedLanguages` in `src/lib/i18n.ts`. Re-run `pnpm seed` to create the corresponding `home` page. Sitemap, hreflang, and Studio update automatically.
