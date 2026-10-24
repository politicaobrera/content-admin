import { ChangeEvent, useEffect, useState } from "react"
import { ArticleType } from "@/app/types/article"
import { Section } from "@/app/types/sections"
import getArticles from "@/app/actions/data/articles/getArticles"
import SectionSelector from "@/app/components/sections/SectionSelector"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import IssueArticleList from "./IssueArticleList"

const MIN_TITLE_LENGTH = 2

interface IssueArticleSelectorProps {
  onChange: (articles: Partial<ArticleType>[]) => void
  currentArticles: Partial<ArticleType>[]
}

const IssueArticleSelector = ({ onChange, currentArticles = [] }: IssueArticleSelectorProps) => {
  const [title, setTitle] = useState("")
  const [section, setSection] = useState<Section | null>(null)
  const [searchResults, setSearchResults] = useState<ArticleType[]>([])
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || !!section

  useEffect(() => {
    if (!hasFilter) {
      setSearchResults([])
      return
    }
    let cancelled = false
    const params = {
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(section ? { section: section._id } : {}),
    }
    getArticles(params).then(({ data, error }) => {
      if (error) console.log("error al buscar", error)
      if (!cancelled) setSearchResults(data ?? [])
    })
    return () => { cancelled = true }
  }, [debouncedTitle, section, hasFilter])

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleAddArticle = async (article: ArticleType) => {
    setTitle("")
    setSearchResults([])
    const alreadyAdded = currentArticles.find(a => a._id === article._id)
    if (!alreadyAdded) {
      onChange([...currentArticles, article])
    }
  }

  const handleRemoveArticle = async (article: Partial<ArticleType>) => {
    onChange(currentArticles.filter(i => i._id !== article._id))
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Notas de este número</h5>
      <div>
        <IssueArticleList
          articles={currentArticles}
          onRemove={handleRemoveArticle}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h6>Buscar</h6>
        <input
          type="text"
          placeholder="Buscar por título..."
          className="w-full border-2"
          value={title}
          onChange={handleTitleChange}
        />
        <SectionSelector
          currentSection={section}
          onChange={setSection}
          isClearable
          showLabel={false}
        />
        {
          searchResults.length > 0 && (
            <ul className="border-2 border-black mt-1">
              {searchResults.map((i, idx) => {
                return (
                  <li key={"issue-article-result-" + idx} onClick={() => handleAddArticle(i)}>
                    {i.title}
                  </li>
                )
              })}
            </ul>
          )
        }
      </div>
    </div>
  )
}

export default IssueArticleSelector
