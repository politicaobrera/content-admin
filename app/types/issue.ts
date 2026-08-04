import { PublicationType } from "./publication"
import { ArticleType } from "./article"

export enum IssueStatus {
  Draft = "draft",
  Published = "published",
}

export type IssueType = {
  _id: string
  publicationId: string | Pick<PublicationType, "_id" | "name" | "slug">
  number: number
  description?: string
  publishDate?: string
  coverImage?: {
    src: string
    caption?: string
  }
  headerKicker?: string
  headerSubtitle?: string
  pdfUrl?: string
  articles?: Partial<ArticleType>[]
  status: IssueStatus
  createdAt?: string
  updatedAt?: string
}
