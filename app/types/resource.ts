import { TagType } from "./tag"

export enum ResourceSourceType {
  Image = "image", 
  Video = "video", 
  Document = "document",
}

export type ResourceType = {
  _id: string
  title: string
  slug: string
  src: string
  sourceType: ResourceSourceType
  caption: string
  tags: TagType[]
  lastModifiedBy: string
  createdAt: string
}