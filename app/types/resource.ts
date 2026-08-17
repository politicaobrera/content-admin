import { TagType } from "./tag"

export enum ResourceSourceType {
  Image = "image",
  Video = "video",
  Document = "document",
  Audio = "audio"
}

export enum ResourceOrigin {
  Resources = "resources",
  Publications = "publications",
}

export type ExternalSource = {
  url: string
  label?: string
}

export type ResourceType = {
  _id: string
  title: string
  slug: string
  src: string
  sourceType: ResourceSourceType
  caption: string
  tags: TagType[]
  externalSources: ExternalSource[]
  lastModifiedBy: string
  createdAt: string
}