import { ChangeEvent } from "react"
import { Section } from "@/app/types/sections"
import { AuthorType } from "@/app/types/author"
import { TagType } from "@/app/types/tag"
import SectionSelector from "@/app/components/sections/SectionSelector"
import AuthorFilterSelector from "@/app/components/authors/AuthorFilterSelector"
import TagSelector from "@/app/components/tags/TagSelector"

interface ArticleSearchFiltersProps {
  title: string
  onTitleChange: (value: string) => void
  onTitleFocus: () => void
  section: Section | null
  onSectionChange: (section: Section | null) => void
  author: AuthorType | null
  onAuthorChange: (author: AuthorType | null) => void
  tags: TagType[]
  onTagsChange: (tags: TagType[]) => void
}

// los 4 filtros de búsqueda de notas (título, sección, autor, tag), compartidos por
// ContentLookupPanel, CampaignLookupPanel e IssueArticleSelector -- junto con
// useArticleSearch, evita que cada lugar reimplemente los mismos 4 inputs
const ArticleSearchFilters = ({
  title, onTitleChange, onTitleFocus,
  section, onSectionChange,
  author, onAuthorChange,
  tags, onTagsChange,
}: ArticleSearchFiltersProps) => {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => onTitleChange(event.target.value)

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Buscar por título..."
        className="w-full border-2 border-gray-400 rounded-md p-1.5 text-gray-900"
        value={title}
        onFocus={onTitleFocus}
        onChange={handleTitleChange}
      />
      <SectionSelector
        currentSection={section}
        onChange={onSectionChange}
        isClearable
        showLabel={false}
      />
      <AuthorFilterSelector currentAuthor={author} onChange={onAuthorChange} />
      <TagSelector currentTags={tags} onChange={onTagsChange} showTitle={false} searchLabel="Buscar por tag" />
    </div>
  )
}

export default ArticleSearchFilters
