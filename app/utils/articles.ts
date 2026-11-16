import { ArticleStatus, ArticleType } from "@/app/types/article"
import { getArticleChangesSincePublish } from "./articleChanges"

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

// misma regla de ruteo que gatsby-node.js del sitio publico: la sección "revista" vive
// bajo /revista/:slug, el resto bajo /:slug
export function getArticlePath(article: { slug: string, section?: { slug?: string } | null }): string {
  return article.section?.slug === "revista" ? `/revista/${article.slug}` : `/${article.slug}`
}

// Published article edited after its last sync (deploy), within the last week.
// Falls back to publishedAt when lastSyncedAt is null (never synced after publish).
// After a week we stop flagging it so stale, never-deployed edits don't linger forever.
//
// La fecha sola no alcanza: updatedAt avanza en CADA guardado, incluso si el valor final
// termina siendo idéntico al publicado (ej. agregar una volanta y después sacarla) --
// eso marcaba la nota como "pendiente" sin que hubiera ningún cambio real para deployar.
// Se exige además que getArticleChangesSincePublish encuentre una diferencia real contra
// publishedSnapshot, la misma comparación que ya usa el modal "Ver cambios" de la tabla.
export function hasPendingChangesSincePublish(article: ArticleType, now: Date = new Date()): boolean {
  if (article.status !== ArticleStatus.Published) return false
  if (!article.publishedAt || !article.updatedAt) return false

  const syncedAt = new Date(article.lastSyncedAt ?? article.publishedAt).getTime()
  const updatedAt = new Date(article.updatedAt).getTime()

  if (updatedAt <= syncedAt) return false
  if (now.getTime() - updatedAt > WEEK_IN_MS) return false

  const changes = getArticleChangesSincePublish(article)
  if (!changes) return false

  return changes.fieldChanges.length > 0 || changes.contentChanged
}
