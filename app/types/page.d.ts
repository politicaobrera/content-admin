import { ArticleType } from "./article"

interface Video {
  src: string
  title: string
}

interface Banner {
  image: {
    src: string
    caption: string
    link: string
  }
}

interface PageType {
  _id: string
  name: string
  videos: Video[]
  banners: Banner[]
  articles: ArticleType[]
}