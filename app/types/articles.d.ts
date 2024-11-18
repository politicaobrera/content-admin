import { Section } from "./sections"

export type ImageTpe = {
  src: string
  caption: string
}

export type MainImageType = ImageTpe & {srcSEO: string}

export type ArticleType = {
  _id: string
  title:string
  slug:string
  content:string
  articleId:number
  subhead?:string
  volanta?:string
  lastModifiedBy:string
  section:Section
  image?: MainImageType
}