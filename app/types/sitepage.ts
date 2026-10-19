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

// tal como viene del backend: puede traer el formato viejo (string suelto, el slug) si
// la portada no se re-guardó desde que se agregó soporte de params/instancias, o el
// nuevo ({slug, instanceId, params}) — se normaliza con normalizeLayoutInstances en
// layoutCatalog.ts antes de usarlo en la UI.
export type RawLayoutEntry = string | { slug: string; instanceId?: string; params?: Record<string, string> }

export interface PageType {
  _id: string
  name: string
  videos: Video[]
  banners: BannerType[]
  articles: Partial<ArticleType>[]
  layouts: RawLayoutEntry[]
}