import { ArticleStatus, ArticleType } from "@/app/types/article"

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

type ArticlePendingChangesFields = Pick<ArticleType, "status" | "publishedAt" | "updatedAt">

// Published article edited after its last publish, within the last week.
// After a week we stop flagging it so stale, never-deployed edits don't linger forever.
export function hasPendingChangesSincePublish(article: ArticlePendingChangesFields, now: Date = new Date()): boolean {
  if (article.status !== ArticleStatus.Published) return false
  if (!article.publishedAt || !article.updatedAt) return false

  const publishedAt = new Date(article.publishedAt).getTime()
  const updatedAt = new Date(article.updatedAt).getTime()

  if (updatedAt <= publishedAt) return false

  return now.getTime() - updatedAt <= WEEK_IN_MS
}
