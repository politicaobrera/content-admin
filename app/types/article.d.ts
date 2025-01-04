import { Section } from "./sections"
import { MainImageType } from "./image"
import { AuthorType } from "./author"

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
  image?: MainImageType
  lastModifiedBy: string
  createdAt: string
}