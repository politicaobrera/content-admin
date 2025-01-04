export type Section = {
  _id: string
  name: string
  slug: string
  style: {
    color: string
    backgroundColor: string
  }
  createdAt: string
  lastModifiedBy: string
}

export type SectionFormType = {
  edit?: boolean
  editInfo?: Section
}

export type SectionProps = {
  section: Section
  onEdit?: (section: Section) => void
  onDelete?: (id: string) => void
}
