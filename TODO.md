# Feature ideas / backlog

Suggestions from a Claude Code session (2026-08-09), ranked by likely usefulness for this admin panel. Not committed to — just a starting backlog to groom.

1. **Autosave / draft recovery for the article editor** — BlockNote content only lives in form state until submit; a crashed tab or accidental navigation loses work.
2. **Scheduled publishing** — add a `publishAt` field + status filter so articles/issues can be queued instead of published immediately.
3. **Global/cross-entity search** — `GenericDataTable` only filters within one table today; a top-level search across articles/authors/tags would save time.
4. **Revision history / rollback for articles** — safety net when an editor overwrites content; would need backend (`content-server`) support to store versions.
5. **SEO fields + live preview** — meta description, og:image, slug editor with auto-slugify and a rendered preview.
6. **Bulk actions in tables** — bulk publish/unpublish, bulk section/tag assignment on top of the existing generic table.
7. **Deploy failure notifications** — `app/deploy/` already polls GitHub Actions run status; surface failures via toast/email instead of requiring someone to check.
8. **Audit log** ("who edited what, when") — useful once more than one editor uses the panel; needs backend support.
9. **Duplicate/clone article** — productivity feature for templated/recurring content (e.g. publication issues).
10. **Image alt-text enforcement** — accessibility + SEO, low effort on top of existing `useMainImage`/`useResourceFile` hooks.
