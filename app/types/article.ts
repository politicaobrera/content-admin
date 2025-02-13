import { Section } from "./sections"
import { MainImageType } from "./image"
import { AuthorType } from "./author"
import { TagType } from "./tag"

export enum ArticleStatus {
  Draft = "draft",
  Published = "published",
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
  status: ArticleStatus
}