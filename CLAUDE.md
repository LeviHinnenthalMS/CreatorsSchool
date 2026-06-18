# CLAUDE.md - Base project

Project guide for working on this codebase. Read first; default behaviors below should be followed unless the user explicitly overrides them in the conversation.

## Stack

- **Next.js 16** (App Router, webpack), **React 19**, **TypeScript**
- **Sanity 5** for content; Studio mounted at `/admin` (see `sanity.config.ts`)
- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **@sanity/document-internationalization** plugin (one document per language, linked via `translation.metadata`)
- **Vercel** for hosting (Analytics + Speed Insights wired up)

## Repo layout

```
src/
  app/(frontend)/        # public site routes
    [[...slug]]/         # dynamic pages (with optional /<lang> prefix)
    blog/[...slug]/      # blog posts
  app/(studio)/admin/    # Sanity Studio
  app/sitemap.ts
  lib/
    i18n.ts              # supportedLanguages, DEFAULT_LANG, langCookieName
    resolveUrl.ts        # builds URLs with language prefix
    processMetadata.ts   # next/metadata + hreflang alternates
    useLang.ts           # client-side current lang from pathname
  proxy.ts               # cookie-based language redirect
  sanity/
    schemaTypes/         # all schemas (documents/, misc/, modules/, objects/)
    structure.tsx        # Studio left-rail tree
    lib/builders.ts      # singleton(), group(), directory(), languageList()
    lib/queries.ts       # GROQ fragments (MODULES_QUERY, TRANSLATIONS_QUERY, etc.)
  ui/
    modules/             # one folder per renderable Sanity module
    LanguageSwitcher/
```

## Internationalization

**This project is built to scale to N languages. Never hardcode `'de'` or `'en'`.**

### Source of truth

`src/lib/i18n.ts` declares every supported language:

```ts
export const supportedLanguages = [
	{ id: 'de', title: 'Deutsch' },
	{ id: 'en', title: 'English' },
	// add new languages here — Studio + sitemap + hreflang update automatically
] as const as Language[]

export const DEFAULT_LANG = languages[0] // currently 'de'
```

`DEFAULT_LANG` is the **no-prefix** language: it lives at `/`, never at `/de/`.

### URL convention

| URL              | Language         |
| ---------------- | ---------------- |
| `/`              | German (default) |
| `/about`         | German           |
| `/en`            | English          |
| `/en/about`      | English          |
| `/<lang>/<slug>` | `<lang>`         |

Slug routing logic is in `src/app/(frontend)/[[...slug]]/page.tsx` (and `blog/[...slug]/page.tsx`). Both default the query language to `DEFAULT_LANG` when no prefix is present, so `/` only resolves German content.

### Adding a new language (e.g. French)

1. Add `{ id: 'fr', title: 'Français' }` to `supportedLanguages` in `src/lib/i18n.ts`. **No other code change required.**
2. In Studio: every translatable type (Pages, Blog posts, Categories, Navigation, all Miscellaneous types) automatically gets a `Français` sub-list.
3. Editors create translations via the i18n plugin's "Translate" panel on any existing document.
4. `sitemap.ts`, `processMetadata.ts` (hreflang), `resolveUrl.ts`, and the Studio structure all read from `supportedLanguages` — they pick up the new lang on the next build.

### Studio organization

`src/sanity/lib/builders.ts` exports `languageList(S, schemaType, title?)`. It produces an `All / <Lang 1> / <Lang 2> / …` sub-tree driven by `supportedLanguages`. Use it for **every translatable document type** in `structure.tsx`. Do not hand-roll per-language list items — they will not stay in sync when a new language is added.

### Page composition: Stage + Page builder

Each `page` document has two distinct content arrays, surfaced as separate Studio groups:

- **Stage** (`stage[]`) — hero/banner section above the page content. Limited to hero variants (`hero`, `hero.saas`, `hero.split`) and capped at one entry. Defined in `src/sanity/schemaTypes/fragments/modules.ts` as the named export `stage`.
- **Page builder** (`modules[]`) — every other content module. Hero types are intentionally excluded from this array.

The frontend GROQ query in `src/app/(frontend)/[[...slug]]/page.tsx` concatenates `stage[]` then `modules[]` (wrapped by global modules). When adding a new module type, decide which bucket it belongs in: hero-like → `stage`, everything else → `modules`. Never add the same type to both.

### Translatable types (registered with the plugin)

`page`, `blog.post`, `blog.category`, `navigation`, `announcement`, `logo`, `person`, `testimonial`. Anything new that contains user-facing copy should be added here.

**Not translated** (currently): `site` (singleton), `global-module`, `redirect`. If a new requirement makes one of these per-language, register it in both `sanity.config.ts` and `structure.tsx`.

### Querying content

When fetching by language in GROQ, always filter:

```groq
*[_type == 'page' && metadata.slug.current == $slug && language == $lang][0]
```

When building URLs across languages, use `resolveUrl(doc, { language })` — it already handles the no-prefix-for-default-lang rule.

## SEO & GEO

### Canonicals & alternates

`processMetadata` emits the canonical URL for the current page and a full `alternates.languages` map (hreflang) drawn from `translations`. Every translatable page should run through it. Never set `<link rel="canonical">` by hand.

### Sitemap

`src/app/sitemap.ts` lists every published `page` and `blog.post` per language with the correct prefix rule (no prefix for `DEFAULT_LANG`). Adding a new language updates it automatically.

### Robots / no-index

`metadata.noIndex` is honored by `processMetadata`. Vercel preview deploys are also set to `noindex`. Do not rely on this for security — it only affects search engines.

### Structured data

If you add a new module type that warrants structured data (Article, Product, BreadcrumbList, etc.), emit JSON-LD at the page level (in the page route or layout), not inside individual modules — keep schema.org output close to the URL it describes. Translate `name`/`description` fields with the document, not the `@context`.

### GEO targeting

Language ≠ region. If we ever need to differentiate (e.g. `de-AT` vs `de-DE`), do **not** invent a new top-level lang code. Add a `region` field to the relevant document type and emit a region-aware hreflang (`hreflang="de-AT"`). Until then, treat `de` as the German-speaking default.

### OG / social

`metadata.image` produces the OG image; `processMetadata` falls back to the `/api/og` route. Every translatable doc has its own metadata — translate it. Never reuse one language's OG image across all locales without confirming.

## Accessibility — WCAG 2.2 AAA target

The project aims at **WCAG 2.2 Level AAA**. When writing UI, treat the following as hard requirements:

### Perceivable

- **Contrast (1.4.6, AAA)**: 7:1 for normal text, 4.5:1 for large text (≥18pt or 14pt bold). Audit any new color combo before merging.
- **Visual presentation (1.4.8, AAA)**: max line length ~80ch, line-height ≥1.5× font-size, paragraph spacing ≥2× font-size, no full-justified text.
- **Images of text (1.4.9, AAA)**: never use rasterized text in images except for logos.
- **Alt text**: every Sanity `image` field used for content must have an `alt` sibling field; decorative images get `alt=""`. Add this when defining new image-bearing schemas.

### Operable

- **Keyboard accessible (2.1)**: every interactive element must be reachable and operable via keyboard. No `onClick` on a non-button/non-link without a key handler + role.
- **No keyboard trap (2.1.2)**: modals must trap focus _inside_ and release on close.
- **Bypass blocks (2.4.1)**: `<SkipToContent>` is already wired in `(frontend)/layout.tsx`. Don't remove it; ensure new layouts include it.
- **Focus visible (2.4.7)** & **focus appearance (2.4.13, AA in 2.2; treat as AAA-baseline)**: never `outline: none` without an equivalent custom indicator with ≥3:1 contrast and ≥2px thickness.
- **Target size (2.5.8, AA in 2.2; AAA target 44×44)**: interactive targets ≥44×44 CSS pixels.
- **No timing (2.2.3, AAA)** / **Interruptions (2.2.4, AAA)**: avoid auto-advancing carousels and forced timeouts. If a session timeout is required, expose `aria-live` warnings.
- **Animation from interactions (2.3.3, AAA)**: respect `prefers-reduced-motion`. Tailwind's `motion-reduce:` variants are the default — use them.

### Understandable

- **Language of page (3.1.1)**: `<html lang>` is set from the URL via `getLang()` in `Root.tsx`. Don't hardcode it.
- **Language of parts (3.1.2)**: wrap inline foreign-language phrases in `<span lang="…">`.
- **Reading level (3.1.5, AAA)**: aim for ≤lower-secondary reading level for marketing copy. This is a content guideline — flag suspect copy in PR review.
- **Predictable (3.2)**: no auto-submitting forms, no context-changing on focus.
- **Error prevention (3.3.6, AAA)**: any submission with legal/financial consequences must be reversible, checked, or confirmed.

### Robust

- **Name, role, value (4.1.2)**: prefer native HTML elements (`<button>`, `<a>`, `<nav>`) over ARIA. Add ARIA only when extending behavior.
- **Status messages (4.1.3)**: form/search results must use `aria-live="polite"` (or `role="status"`).

### Practical defaults

- **Headings**: one `<h1>` per route. Use `MODULES_QUERY` heading data to keep the outline correct.
- **Forms**: every input has a visible `<label>`; required fields use `aria-required` and visible "required" text (not just an asterisk).
- **Color is not the only cue (1.4.1)**: error states must use icon/text in addition to red.
- **Motion**: gate any non-essential animation behind `motion-safe:`.

## Conventions for new code

- **No hardcoded content. Ever.** Every user-facing value rendered in the UI — copy, labels, link targets, images, CTAs, navigation entries, prices, testimonials, country/language codes used as content — must come from Sanity. If a Figma component (or any spec) needs data the schema cannot supply today, **stop and propose the missing schema fields** (document type, field name, type, validation, Studio placement) and wait for confirmation before adding them. Only then wire the UI to those new fields.
- **Sanity fields stack vertically — always.** Never put two fields side-by-side in Studio. That means: never use `options: { columns: N }` on an object/document type, and never set `options: { columns: N }` on a fieldset. Editors read top-to-bottom; multi-column layouts make forms harder to scan and complicate translation review.
- **Match Figma 1:1.** Any Figma file or frame shared in conversation is the spec, not inspiration. Spacing, font sizes, line heights, weights, colors, radii, border widths, shadows, icon sizes, breakpoints, hover/open/disabled states — all of it must match exactly. Read variable definitions and design tokens from the Figma file with the MCP tools and map them to existing project tokens (`src/styles/app.css`); if a token is missing in the project, add it rather than inlining a literal value. If something in the design is genuinely ambiguous, ask before improvising.
- **Animation: minimal, intentional, UX-positive.** Don't add motion for its own sake, but proactively add small transitions and animations that make the interface feel more responsive and polished — fade/translate on dropdown open, hover state crossfades, focus ring transitions, chevron rotation on toggle, page transitions for cross-route navigation, skeleton fades on load, etc. Use the existing `anim-fade-to-*` utilities and CSS transitions; reach for Framer Motion only when CSS can't express the interaction. Always respect `prefers-reduced-motion` (Tailwind's `motion-safe:` / `motion-reduce:` variants — see the Accessibility section). Keep durations short (120–250ms) and easings consistent.
- **No new content type without language consideration.** If it has user-facing copy, register it with `documentInternationalization` in `sanity.config.ts`, add the `language` field to its schema (the read-only/hidden block), and use `languageList(...)` in `structure.tsx`.
- **Drive language-aware logic from `supportedLanguages`**, never from a hardcoded array of two.
- **Use `resolveUrl(doc, { language })` for any internal link** rendering. Don't concatenate `/`+slug by hand.
- **Use the `Img` component** (`@/ui/Img`) for Sanity images; it wraps `next/image` and handles LQIP plus Sanity URL sizing via `@sanity/image-url`.
- **Tailwind utility-first**, no inline styles unless dynamic. Use `cn()` from `@/lib/utils` for conditional class merging.
- **Server components by default**; only mark `'use client'` when you need state, effects, or browser APIs.

## Git workflow

- **Never run `git commit` or `git push`.** The maintainer handles all commits and pushes themselves. Leave the working tree dirty when work is done; do not stage, commit, amend, or push under any circumstances. Read-only inspection (`git status`, `git diff`, `git log`) is fine.

## Build & verify

- `pnpm dev` (or `npm run dev`) — local dev with webpack.
- `pnpm build` — production build.
- `pnpm typecheck` — strict TS check; pre-existing template errors live in `src/sanity/ui/` and are tracked separately. New code should not add new errors.
- For UI/i18n changes, manually verify both `/` (default lang) and `/<lang>/...` (each non-default) before merging.
