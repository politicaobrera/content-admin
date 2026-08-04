import { ChangeEvent, useRef, useState } from "react"
import { ArticleType } from "@/app/types/article"
import getArticles from "@/app/actions/data/articles/getArticles"
import IssueArticleList from "./IssueArticleList"

interface IssueArticleSelectorProps {
  onChange: (articles: Partial<ArticleType>[]) => void
  currentArticles: Partial<ArticleType>[]
}

const IssueArticleSelector = ({ onChange, currentArticles = [] }: IssueArticleSelectorProps) => {
  const searchArticleRef = useRef<HTMLInputElement>(null)
  const [searchResults, setSearchResults] = useState<ArticleType[]>([])

  const handleSearchArticleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value
    if (q && q.length > 1) {
      const { data, error } = await getArticles({ title: q })
      if (error) {
        console.log("error al buscar", error)
      }
      if (data) {
        setSearchResults(data)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleAddArticle = async (article: ArticleType) => {
    if (searchArticleRef?.current?.value) {
      searchArticleRef.current.value = ''
    }
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
          className="w-full border-2"
          ref={searchArticleRef}
          onChange={handleSearchArticleChange}
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
