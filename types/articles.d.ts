import { Section } from "./sections"

export type Article = {
  title:string
  slug:string
  content:string
  articleId:number
  subhead:string
  volanta:string
  lastModifiedBy:string
  section:Section
}