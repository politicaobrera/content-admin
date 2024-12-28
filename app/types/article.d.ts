import { Section } from "./sections"
import { MainImageType } from "./image"

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
  createdAt: string;
}