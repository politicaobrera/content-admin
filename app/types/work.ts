import { AuthorType } from "./author"
import { TagType } from "./tag"

export type WorkKind = "libro" | "carta" | "ensayo" | "manuscrito" | "articulo" | "otro"

export type WorkChapterType = {
  title: string
  slug: string
  content: string
  order: number
}

export type WorkType = {
  _id: string
  title: string
  slug: string
  authors: AuthorType[]
  year?: string
  kind: WorkKind
  description?: string
  pdfUrl?: string
  chapters: WorkChapterType[]
  tags: TagType[]
  sourceUrl: string
  sourceLabel: string
  license: "dominio-publico" | "cc-by-sa"
  lastModifiedBy?: string
  createdAt: string
}
