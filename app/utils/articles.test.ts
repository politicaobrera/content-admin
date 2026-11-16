import { hasPendingChangesSincePublish } from "./articles"
import { ArticleStatus, ArticleType } from "@/app/types/article"

const NOW = new Date("2026-08-11T12:00:00.000Z")

const baseArticle: ArticleType = {
  _id: "1",
  title: "Título original",
  slug: "1-titulo-original",
  content: "<p>contenido</p>",
  articleId: 1,
  subhead: "Bajada original",
  volanta: "Volanta original",
  keyIdeas: [],
  section: { _id: "sec-1", name: "Política", slug: "politica", style: { color: "#000", backgroundColor: "#fff" }, createdAt: "", lastModifiedBy: "" },
  authors: [{ _id: "a-1", name: "Autor Uno", slug: "autor-uno", descriptions: [], lastModifiedBy: "", createdAt: "" }],
  authorsDescriptions: [""],
  tags: [{ _id: "t-1", name: "Tag Uno", slug: "tag-uno", lastModifiedBy: "", createdAt: "" }],
  lastModifiedBy: "joaquin",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-05T00:00:00.000Z",
  publishedAt: "2026-08-01T00:00:00.000Z",
  lastSyncedAt: "2026-08-01T00:00:00.000Z",
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

describe("hasPendingChangesSincePublish", () => {
  it("returns false for draft articles", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Draft,
      publishedAt: "2026-08-01T00:00:00.000Z",
      lastSyncedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns false when publishedAt is missing", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      publishedAt: null,
      lastSyncedAt: null,
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns false when the article was not edited after it was published", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      publishedAt: "2026-08-05T00:00:00.000Z",
      lastSyncedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns true when edited after publish, within the last week, with a real field change", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      volanta: "Volanta nueva",
      publishedAt: "2026-08-05T00:00:00.000Z",
      lastSyncedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-10T00:00:00.000Z",
    }, NOW)).toBe(true)
  })

  it("returns false when the edit happened more than a week ago", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      volanta: "Volanta nueva",
      publishedAt: "2026-07-01T00:00:00.000Z",
      lastSyncedAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-20T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  // caso que motivó el fix: se edita un campo y se revierte al mismo valor que tenía
  // publishedSnapshot -- updatedAt avanza igual en cada guardado, pero no hay ningún
  // cambio real para deployar, así que no debería marcarse como pendiente
  it("returns false when the field was edited and reverted to the published value", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      volanta: "Volanta original", // igual al publishedSnapshot
      publishedAt: "2026-08-05T00:00:00.000Z",
      lastSyncedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-10T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns true when the content changed even without a tracked field change", () => {
    expect(hasPendingChangesSincePublish({
      ...baseArticle,
      status: ArticleStatus.Published,
      content: "<p>contenido nuevo</p>",
      publishedAt: "2026-08-05T00:00:00.000Z",
      lastSyncedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-10T00:00:00.000Z",
    }, NOW)).toBe(true)
  })
})
