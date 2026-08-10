# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js (App Router) admin panel for managing content ("Política Obrera" news site): articles, sections, tags, authors, resources, homepage layout ("Portada"), and triggering site deploys. This app is a client for a separate headless content API (`CONTENT_SERVER_URL`) — it holds no database of its own.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm start` — run production build
- `npm run lint` — ESLint (`next/core-web-vitals` config)
- `npm test` — run the Jest test suite once
- `npm run test:watch` — run Jest in watch mode

## Testing

Jest + React Testing Library, configured via the `next/jest` preset (`jest.config.js`, `jest.setup.js`) so config/env loading matches `next build`. `jsdom` is the test environment; `@/*` resolves the same as in app code.

- Test files live next to the code they cover, as `*.test.ts`/`*.test.tsx` (e.g. `app/utils/query.test.ts`, `app/components/Button.test.tsx`).
- Pure helpers (`app/utils/*`) and hooks are the easiest and highest-value things to unit test.
- Client components (`'use client'`) can be rendered directly with `@testing-library/react`; use `@testing-library/user-event` for interactions.
- Server actions (`'use server'` files under `app/actions/`) call `getAuthorizationHeader()` → NextAuth under the hood — mock that chain (or the module doing the `fetch` call) rather than hitting the real backend API.
- There is no E2E/browser test setup (e.g. Playwright) yet — add one only if explicitly requested.

Package manager: both `package-lock.json` and `yarn.lock` are committed; the Dockerfile installs with `npm install`. Use npm for consistency with the Docker build.

## Environment

Copy `example.env` to `.env.local`. Required vars:
- `CONTENT_SERVER_URL` — base URL of the backend content API
- `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `WORKFLOW` — used by the Deploy feature to dispatch a GitHub Actions workflow and poll its run status
- `NEXTAUTH_SECRET` — NextAuth JWT signing secret

Firebase config (used only for file/image storage) is currently hardcoded in `app/services/firebase/storage.ts` rather than sourced from env vars.

## Architecture

**Per-entity vertical slices.** Each content type (`articles`, `authors`, `sections`, `tags`, `resources`, `pages`) follows the same layout under `app/<entity>/`:
- `page.tsx` — list view, `[id]/page.tsx` — edit view, `new/page.tsx` — create view
- `components/` — entity-specific form/table/list components
- `hooks/use<Entity>.ts` — thin wrapper that calls the corresponding server action and returns `{data, error}`

Data access lives in `app/actions/data/<entity>/*.ts` — Next.js Server Actions (`'use server'`) that call the backend REST API at `${CONTENT_SERVER_URL}/<entity>` via `fetch`/`axios`. Every action:
- calls `getAuthorizationHeader()` (from `app/actions/getAuthorizationHeader.ts`) to attach the session's bearer token
- returns the shared `iResponseOne<T>` / `iResponseMany<T>` shape (`app/types/responses.ts`): `{data?, error?, meta?}` — errors are returned as values, not thrown, so callers must check `.error` rather than try/catch
- uses `cache: 'no-store'` on reads since content changes frequently

When adding a new entity or endpoint, mirror this existing pattern (server action → hook → page/components) rather than inventing a new one.

**Auth.** NextAuth (`app/lib/auth.ts`) uses a Credentials provider that logs in against the backend (`POST ${CONTENT_SERVER_URL}/auth/login`) and stores the backend's `sessionToken` in the JWT. `getSession()` → `getCurrentUser()` → `getAuthorizationHeader()` (all in `app/actions/`) form the chain used by every server action to authenticate outbound requests to the content API. `middleware.ts` gates `/main`, `/sections`, and `/articles` behind `withAuth`, and separately blocks a couple of known bad request paths.

**Deploy flow.** `app/deploy/` triggers a GitHub Actions workflow dispatch (`throwDeployProcess`) against `GITHUB_OWNER/GITHUB_REPO`'s `WORKFLOW`, then polls job status (`getDeployProcess`) — this is how content changes made in this admin get published to the live site.

**Portada (homepage) builder.** `app/main/` lets editors arrange the homepage: drag-and-drop article ordering (`@dnd-kit`, `DraggableArticle.tsx`/`ArticlesSorter.tsx`), banner selection, and video selection, backed by `app/main/hooks/usePortada.ts` and `useBanner.ts`.

**Rich text editing.** Article bodies are edited with BlockNote (`@blocknote/core`/`react`/`mantine`) in `app/components/inputs/BlockNoteEditor.tsx` with a custom schema in `BlockNoteEditorSchema.tsx` (includes a custom iframe block). Content is converted to/from HTML for storage in the backend.

**Generic form/table utilities.** `app/hooks/useGenericForm.ts` builds a `react-hook-form` + `yup` schema from a declarative `InputData[]` array and flattens `field_subfield`-named inputs into nested objects on submit (`flatValuesToFinalObject`, two levels deep). `app/components/form/GenericForm.tsx` and `app/components/table/GenericDataTable.tsx` (generic filter/sort/paginate table, syncs state to URL search params) are reused across entities — prefer extending these over writing bespoke forms/tables for a new entity unless requirements diverge significantly.

**Global context** (`app/layout.tsx`): `AuthContext` (NextAuth `SessionProvider`) wraps `Sidebar` (server component, only rendered when a user is logged in) wraps `SectionsProvider` (fetches all sections once on mount into `SectionsContext`, used by selectors like `SectionSelector`).

**Image/file uploads (deferred pattern).** Images/PDFs are compressed client-side (`browser-image-compression`) as soon as a file is selected, but the actual upload to Firebase Storage (`app/services/firebase/storage.ts`) is deferred until the parent entity is saved — one single save covers both the entity's fields and any pending file uploads. `app/resources/hooks/useResourceFile.ts` + `app/resources/components/ResourceSelector.tsx` implement this generically (parameterized by `sourceType`/`origin`/`fileName`) and are used by `resources`, `publications`, and `issues` (`ResourceSelector`'s `deferUpload` prop): the form holds a `ref` per file input and calls `ref.current.resolveUrl()` in `onSubmit` to get the final URL (or the existing one if unchanged) before building the payload. Articles use a bespoke variant of the same deferred idea — `app/hooks/image/useMainImage.ts` + `app/components/image/MainImage.tsx` — because one selected file produces two uploaded derivatives (a full-size main image and a smaller SEO image, both stored under `/imagenes/`) rather than a single resource file; `ArticleForm.tsx` calls `mainImageRef.current.resolveImage()` in `onSubmit` the same way.

**CSP.** `next.config.js` sets a strict Content-Security-Policy allowlisting specific third-party domains (YouTube, Twitter, Facebook, Vimeo, Instagram, Google Analytics, Firebase Storage, jsdelivr, Google Fonts). When integrating a new embed or external asset/script source, update this policy.

# Contexto del otro proyecto (CMS backend)
   @E:\cloudeProjects\repos\content-server/CLAUDE.md

## Notes

- `app/pruebas/` is a scratch/testing page, not production functionality.
- Server actions log errors in Spanish (e.g. `Error al obtener los articulos`) — match this convention for user-facing/log messages in that layer.
