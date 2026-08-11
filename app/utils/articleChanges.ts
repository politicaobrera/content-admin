import { ArticleType } from "@/app/types/article"

export type ArticleFieldChange = {
  field: string
  label: string
  from: string
  to: string
}

export type ArticleChangesSincePublish = {
  fieldChanges: ArticleFieldChange[]
  contentChanged: boolean
}

const EMPTY_PLACEHOLDER = "(vacío)"
const NONE_PLACEHOLDER = "(ninguno)"

function namesOf(items: { name: string }[] | undefined): string {
  return (items ?? []).map(i => i.name).sort().join(", ")
}

// Diffs the article's current editorial fields against the snapshot taken at its last
// publish. Returns null when there's no snapshot to diff against (e.g. never published).
export function getArticleChangesSincePublish(article: ArticleType): ArticleChangesSincePublish | null {
  const snapshot = article.publishedSnapshot
  if (!snapshot) return null

  const fieldChanges: ArticleFieldChange[] = []

  if (article.title !== snapshot.title) {
    fieldChanges.push({ field: "title", label: "Título", from: snapshot.title, to: article.title })
  }

  if ((article.subhead || "") !== (snapshot.subhead || "")) {
    fieldChanges.push({
      field: "subhead",
      label: "Bajada",
      from: snapshot.subhead || EMPTY_PLACEHOLDER,
      to: article.subhead || EMPTY_PLACEHOLDER,
    })
  }

  if ((article.volanta || "") !== (snapshot.volanta || "")) {
    fieldChanges.push({
      field: "volanta",
      label: "Volanta",
      from: snapshot.volanta || EMPTY_PLACEHOLDER,
      to: article.volanta || EMPTY_PLACEHOLDER,
    })
  }

  const currentSectionId = article.section?._id ?? null
  const snapshotSectionId = snapshot.section?._id ?? null
  if (currentSectionId !== snapshotSectionId) {
    fieldChanges.push({
      field: "section",
      label: "Sección",
      from: snapshot.section?.name || NONE_PLACEHOLDER,
      to: article.section?.name || NONE_PLACEHOLDER,
    })
  }

  const currentTagNames = namesOf(article.tags)
  const snapshotTagNames = namesOf(snapshot.tags)
  if (currentTagNames !== snapshotTagNames) {
    fieldChanges.push({
      field: "tags",
      label: "Tags",
      from: snapshotTagNames || NONE_PLACEHOLDER,
      to: currentTagNames || NONE_PLACEHOLDER,
    })
  }

  const currentAuthorNames = namesOf(article.authors)
  const snapshotAuthorNames = namesOf(snapshot.authors)
  if (currentAuthorNames !== snapshotAuthorNames) {
    fieldChanges.push({
      field: "authors",
      label: "Autores",
      from: snapshotAuthorNames || NONE_PLACEHOLDER,
      to: currentAuthorNames || NONE_PLACEHOLDER,
    })
  }

  return {
    fieldChanges,
    contentChanged: article.content !== snapshot.content,
  }
}
