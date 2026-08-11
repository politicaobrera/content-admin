import { Section } from "./sections"
import { MainImageType } from "./image"
import { AuthorType } from "./author"
import { TagType } from "./tag"

export enum ArticleStatus {
  Draft = "draft",
  Published = "published",
}

export type PublishedSnapshot = {
  title: string
  subhead?: string
  volanta?: string
  content: string
  section: { _id: string, name: string } | null
  tags: { _id: string, name: string }[]
  authors: { _id: string, name: string }[]
}

export type ArticleType = {
  _id: string
  title: string
  slug: string
  content: string
  articleId: number
  subhead?: string
  volanta?: string
  section: Section
  authors: AuthorType[]
  authorsDescriptions: string[]
  tags: TagType[]
  image?: MainImageType
  lastModifiedBy: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  publishedSnapshot: PublishedSnapshot | null
  status: ArticleStatus
}