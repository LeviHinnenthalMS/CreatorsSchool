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

| Document | Slug  | Purpose                  |
| -------- | ----- | ------------------------ |
| `page`   | `404` | "Page not found" content |

The blog overview is available automatically at `/blog`. Create and publish
entries under **Blog posts** in Sanity Studio; no overview page needs to be
maintained manually.

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

## Search and AI discovery

- `/robots.txt` allows public pages, assets, and `/api/og` previews for all crawlers, including AI search crawlers. Studio and other API routes are excluded. Vercel preview deployments disallow all crawling. This is a crawl policy, not access control; training crawlers also retain the existing public access.
- `/llms.txt` provides the school overview, contact details, and annotated links to published pages, courses, performances, and articles.
- `/llms-full.txt` adds published course descriptions, age groups and other facts, prices with their units, and FAQs. Other pages are linked with summaries; this is not a full website export.
- `/sitemap.xml` lists indexable URLs. It and the LLM files always fetch the **published** Sanity perspective, even with a Studio preview cookie. Drafts and visual editing annotations are never included.

The LLM guide omits `noIndex` content, internal component examples, legacy pages replaced by offerings, and unsupported language routes. Empty sections are omitted. Public HTML links to `/llms.txt` using `rel="describedby"`; both text documents are crawlable but carry `X-Robots-Tag: noindex` so they do not compete with the source pages in search results.

Content is maintained in the existing Sanity fields, with no separate AI copy to update. The data cache refreshes hourly and uses document-type tags that the existing `/api/revalidate` webhook invalidates on publish, update, or unpublish. The text responses require revalidation instead of adding a second CDN cache window. Prices and availability should always be confirmed on the linked source pages.

Set `NEXT_PUBLIC_BASE_URL` to the canonical production origin before deploying. Local development intentionally uses localhost. Verify `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/llms-full.txt` after deployment, including the crawl policy on a Vercel preview.

`llms.txt` follows the [llms.txt proposal](https://llmstxt.org/). It helps agents navigate the content; it is not a ranking guarantee. [Google does not require special AI files](https://developers.google.com/search/docs/appearance/ai-features) for AI Overviews or AI Mode.
