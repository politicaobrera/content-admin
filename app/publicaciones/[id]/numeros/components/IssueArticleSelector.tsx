import { ArticleType } from "@/app/types/article"
import useArticleSearch from "@/app/articles/hooks/useArticleSearch"
import ArticleSearchFilters from "@/app/articles/components/ArticleSearchFilters"
import IssueArticleList from "./IssueArticleList"

interface IssueArticleSelectorProps {
  onChange: (articles: Partial<ArticleType>[]) => void
  currentArticles: Partial<ArticleType>[]
}

// búsqueda de notas (título + sección + autor + tag) compartida con
// ContentLookupPanel y CampaignLookupPanel -- ver useArticleSearch
const IssueArticleSelector = ({ onChange, currentArticles = [] }: IssueArticleSelectorProps) => {
  const { state, actions } = useArticleSearch()

  const handleAddArticle = (article: ArticleType) => {
    actions.reset()
    const alreadyAdded = currentArticles.find(a => a._id === article._id)
    if (!alreadyAdded) {
      onChange([...currentArticles, article])
    }
  }

  const handleRemoveArticle = (article: Partial<ArticleType>) => {
    onChange(currentArticles.filter(i => i._id !== article._id))
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Notas de este número</h5>
      <IssueArticleList
        articles={currentArticles}
        onRemove={handleRemoveArticle}
      />
      <ArticleSearchFilters
        title={state.title}
        onTitleChange={actions.setTitle}
        onTitleFocus={actions.handleFocus}
        section={state.section}
        onSectionChange={actions.setSection}
        author={state.author}
        onAuthorChange={actions.setAuthor}
        tags={state.tags}
        onTagsChange={actions.setTags}
      />
      {state.showingRecent && state.results.length > 0 && (
        <p className="text-xs text-gray-500 italic">Últimas notas:</p>
      )}
      {state.results.length > 0 && (
        <ul className="border-2 border-black rounded-md overflow-hidden">
          {state.results.map((article) => {
            const alreadyAdded = currentArticles.some((a) => a._id === article._id)
            return (
              <li
                key={article._id}
                onClick={() => !alreadyAdded && handleAddArticle(article)}
                className={
                  "px-3 py-2 text-gray-900 border-b border-gray-200 last:border-b-0 " +
                  (alreadyAdded ? "opacity-50 cursor-default" : "cursor-pointer hover:bg-gray-100")
                }
              >
                {article.title}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default IssueArticleSelector
