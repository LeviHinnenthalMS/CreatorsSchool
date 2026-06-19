---
description: Bootstrap this base project for a fresh use — rename, install, link Sanity, write .env.local, seed singletons, optionally link Vercel, verify.
---

You are running the project setup. Be conversational but terse. Ask one question, get the answer, move on. Never invent values — always ask or read from the user.

## Pre-flight

1. Read `package.json` to detect current project name. If it is still `base-project`, treat this as a fresh setup. If not, ask the user whether they want to re-run setup (and which steps).
2. Read `.env.local` if it exists. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is already set, skip to step 4 unless the user asks to reset.
3. Confirm pnpm is the package manager (`pnpm-lock.yaml` exists). If the user uses npm/yarn, ask before proceeding — every command below uses `pnpm`.

## Steps

### 1. Rename

Ask: **"What's the project name? (slug for package.json, e.g. `acme-site`)"** and **"What's the human-readable title? (shown in Studio + browser tab, e.g. `Acme`)"**.

Then update:
- `package.json` → `name`, `description`
- `sanity.config.ts` → `title: 'Base Project'` → the new title
- `src/app/(frontend)/layout.tsx` → any default `title` / `description` in metadata
- `README.md` → first heading + intro line

Show a diff before writing.

### 2. Install

Run `pnpm install`. If `node_modules` already exists, skip unless lockfile changed.

### 3. Sanity

Ask: **"Use an existing Sanity project, or create a new one?"**

- **Existing**: ask for `projectId` and `dataset` (default: `production`). Confirm by running `npx sanity projects list` if the user is unsure (they need to be logged in: `npx sanity login`).
- **New**: instruct the user to run `npx sanity init --bare` in a separate terminal (it's interactive and needs their browser). When done, ask for the resulting `projectId` and `dataset`.

Ask for a **read token** and **write token** from https://www.sanity.io/manage → project → API → Tokens. Read = Viewer, Write = Editor. The write token is only needed for seeding; the user can revoke it after.

Ask for a `SANITY_REVALIDATE_SECRET` — generate one with `openssl rand -hex 32` and show the value for them to copy into the Sanity webhook config later.

### 4. Write .env.local

Read `.env.example`, fill in the collected values, leave the rest blank (or ask for `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_COOKIEYES_SRC` — all optional). Write `.env.local`. Show what you wrote (mask tokens — show first 8 chars + `…`).

### 5. Seed

Run `pnpm seed`. This creates the `site` singleton and a `home` page per language in `supportedLanguages`. It's idempotent — safe to re-run. If it fails because the write token is wrong, surface the error and ask for a new token.

### 6. Vercel (optional)

Ask: **"Link a Vercel project now? (y/N)"**

- yes → `vercel link` (interactive), then `vercel env pull .env.local` if they want to keep env in sync with Vercel.
- no → skip; remind them they can run `vercel link` later.

### 7. Verify

Run in parallel:
- `pnpm typecheck`
- `pnpm dev` in background, then wait for the first compiled page and curl `http://localhost:3000/` — expect 200. Kill the dev server.

Report: ✅ what worked, ❌ what failed with the exact next step.

## Done

Tell the user:
- Studio: http://localhost:3000/admin
- Site: http://localhost:3000
- What to edit next: site title/logo in `/admin`, then create real pages.

## Rules

- Never commit. Never push. Working tree stays dirty.
- Never write tokens into anything other than `.env.local`.
- Never skip a question by guessing. If you don't know, ask.
- If any step fails, stop and report. Don't paper over errors.
