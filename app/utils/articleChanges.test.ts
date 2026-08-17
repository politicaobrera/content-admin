import { getArticleChangesSincePublish } from "./articleChanges"
import { ArticleStatus, ArticleType } from "@/app/types/article"

const baseArticle: ArticleType = {
  _id: "1",
  title: "Título original",
  slug: "1-titulo-original",
  content: "<p>contenido</p>",
  articleId: 1,
  subhead: "Bajada original",
  volanta: "Volanta original",
  section: { _id: "sec-1", name: "Política", slug: "politica", style: { color: "#000", backgroundColor: "#fff" }, createdAt: "", lastModifiedBy: "" },
  authors: [{ _id: "a-1", name: "Autor Uno", slug: "autor-uno", descriptions: [], lastModifiedBy: "", createdAt: "" }],
  authorsDescriptions: [""],
  tags: [{ _id: "t-1", name: "Tag Uno", slug: "tag-uno", lastModifiedBy: "", createdAt: "" }],
  lastModifiedBy: "joaquin",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-05T00:00:00.000Z",
  publishedAt: "2026-08-01T00:00:00.000Z",
  publishedSnapshot: {
    title: "Título original",
    subhead: "Bajada original",
    volanta: "Volanta original",
    content: "<p>contenido</p>",
    section: { _id: "sec-1", name: "Política" },
    tags: [{ _id: "t-1", name: "Tag Uno" }],
    authors: [{ _id: "a-1", name: "Autor Uno" }],
  },
  relatedArticles: [],
  relatedResources: [],
  status: ArticleStatus.Published,
}

describe("getArticleChangesSincePublish", () => {
  it("returns null when there's no published snapshot", () => {
    expect(getArticleChangesSincePublish({ ...baseArticle, publishedSnapshot: null })).toBeNull()
  })

  it("returns no field changes and contentChanged false when nothing differs", () => {
    expect(getArticleChangesSincePublish(baseArticle)).toEqual({ fieldChanges: [], contentChanged: false })
  })

  it("detects a title change", () => {
    const result = getArticleChangesSincePublish({ ...baseArticle, title: "Título nuevo" })
    expect(result?.fieldChanges).toEqual([
      { field: "title", label: "Título", from: "Título original", to: "Título nuevo" },
    ])
  })

  it("detects a section change", () => {
    const result = getArticleChangesSincePublish({
      ...baseArticle,
      section: { ...baseArticle.section, _id: "sec-2", name: "Economía" },
    })
    expect(result?.fieldChanges).toEqual([
      { field: "section", label: "Sección", from: "Política", to: "Economía" },
    ])
  })

  it("detects a tags change regardless of order", () => {
    const result = getArticleChangesSincePublish({
      ...baseArticle,
      tags: [
        { _id: "t-2", name: "Tag Dos", slug: "tag-dos", lastModifiedBy: "", createdAt: "" },
        { _id: "t-1", name: "Tag Uno", slug: "tag-uno", lastModifiedBy: "", createdAt: "" },
      ],
    })
    expect(result?.fieldChanges).toEqual([
      { field: "tags", label: "Tags", from: "Tag Uno", to: "Tag Dos, Tag Uno" },
    ])
  })

  it("flags contentChanged without exposing the actual diff", () => {
    const result = getArticleChangesSincePublish({ ...baseArticle, content: "<p>contenido nuevo</p>" })
    expect(result?.contentChanged).toBe(true)
    expect(result?.fieldChanges).toEqual([])
  })

  it("uses placeholders for empty subhead/volanta", () => {
    const result = getArticleChangesSincePublish({ ...baseArticle, subhead: "" })
    expect(result?.fieldChanges).toEqual([
      { field: "subhead", label: "Bajada", from: "Bajada original", to: "(vacío)" },
    ])
  })
})
