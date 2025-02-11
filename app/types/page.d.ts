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

export interface PageType {
  _id: string
  name: string
  videos: Video[]
  banners: BannerType[]
  articles: ArticleType[]
}