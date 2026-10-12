import { ArticleType } from "./article"
import { ResourceType } from "./resource"
import { EventType } from "./event"

export enum CampaignStatus {
  Draft = "draft",
  Published = "published",
}

export type CampaignType = {
  _id: string
  title: string
  slug: string
  description: string
  relatedArticles: Partial<ArticleType>[]
  relatedResources: Partial<ResourceType>[]
  relatedEvents: Partial<EventType>[]
  status: CampaignStatus
  // solo tiene sentido en status === Published — ver campaigns.controller.ts en content-server
  isActive: boolean
  lastModifiedBy: string
  createdAt: string
  updatedAt: string
}
