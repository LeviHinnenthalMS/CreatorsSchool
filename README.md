# Creators School

Next.js 16 + Sanity site. Single default locale (German, `/`) with an i18n system that scales to N languages by adding entries to `supportedLanguages` in `src/lib/i18n.ts`.

For project conventions (i18n, Studio structure, SEO, accessibility), see [`CLAUDE.md`](./CLAUDE.md).

### Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Sanity 6 (Studio embedded at `/admin`)
- Tailwind CSS 4
- Vercel (Analytics + Speed Insights)

## Local development

```sh
pnpm install
pnpm run dev
```

- Website: http://localhost:3000
- Studio: http://localhost:3000/admin

## Environment variables

Copy `.env.example` to `.env.local` and fill in your own Sanity project:

```ini
NEXT_PUBLIC_BASE_URL=""           # e.g. https://example.com
NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET=""     # usually "production"
SANITY_API_READ_TOKEN=""          # Viewer token from sanity.io/manage
SANITY_API_WRITE_TOKEN=""         # for /api/subscribe writes
SANITY_REVALIDATE_SECRET=""
```

## Required Sanity documents

Before the site renders, publish at minimum:

| Document | Slug    | Purpose         |
| -------- | ------- | --------------- |
| `site`   |         | Global settings |
| `page`   | `index` | Homepage        |

Optional but commonly used:

| Document        | Slug / path    | Purpose                                                   |
| --------------- | -------------- | --------------------------------------------------------- |
| `page`          | `404`          | "Page not found" content                                  |
| `page`          | `blog`         | Blog listing (add the **Blog frontpage** module)          |
| `global-module` | `blog/` (path) | Blog post template (add the **Blog post content** module) |

## Scripts

```sh
pnpm run dev         # local dev server
pnpm run build       # production build
pnpm run start       # run the production build
pnpm run lint        # ESLint
pnpm run typecheck   # tsc --noEmit
```

## Adding a new language

1. Add an entry to `supportedLanguages` in `src/lib/i18n.ts` (e.g. `{ id: 'en', title: 'English' }`).
2. Add UI chrome label maps in `src/lib/uiLabels.ts` for the new lang (TypeScript will tell you what is missing).
3. In Studio, every translatable type automatically exposes a sub-list for the new language.

## Deployment

Connect the repo to Vercel, set the env vars above, and deploy.
