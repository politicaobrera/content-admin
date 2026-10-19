import { ArticleType } from "./article"

export interface Video {
  src: string
  title: string
}

export interface BannerType {
  _id?: string
  src: string
  caption: string
  link: string
}

// formato viejo (string) o nuevo ({slug, instanceId, params}) — normalizar con
// normalizeLayoutInstances en layoutCatalog.ts antes de usar en la UI
export type RawLayoutEntry = string | { slug: string; instanceId?: string; params?: Record<string, string> }

export interface PageType {
  _id: string
  name: string
  videos: Video[]
  banners: BannerType[]
  articles: Partial<ArticleType>[]
  layouts: RawLayoutEntry[]
}