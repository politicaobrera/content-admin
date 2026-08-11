import { hasPendingChangesSincePublish } from "./articles"
import { ArticleStatus } from "@/app/types/article"

const NOW = new Date("2026-08-11T12:00:00.000Z")

describe("hasPendingChangesSincePublish", () => {
  it("returns false for draft articles", () => {
    expect(hasPendingChangesSincePublish({
      status: ArticleStatus.Draft,
      publishedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns false when publishedAt is missing", () => {
    expect(hasPendingChangesSincePublish({
      status: ArticleStatus.Published,
      publishedAt: null,
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns false when the article was not edited after it was published", () => {
    expect(hasPendingChangesSincePublish({
      status: ArticleStatus.Published,
      publishedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-05T00:00:00.000Z",
    }, NOW)).toBe(false)
  })

  it("returns true when edited after publish, within the last week", () => {
    expect(hasPendingChangesSincePublish({
      status: ArticleStatus.Published,
      publishedAt: "2026-08-05T00:00:00.000Z",
      updatedAt: "2026-08-10T00:00:00.000Z",
    }, NOW)).toBe(true)
  })

  it("returns false when the edit happened more than a week ago", () => {
    expect(hasPendingChangesSincePublish({
      status: ArticleStatus.Published,
      publishedAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-20T00:00:00.000Z",
    }, NOW)).toBe(false)
  })
})
