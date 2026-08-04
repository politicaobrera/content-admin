import { ArticleType } from "@/app/types/article"
import { HiXCircle } from 'react-icons/hi2'

interface IssueArticleListProps {
  articles: Partial<ArticleType>[]
  onRemove?: (item: Partial<ArticleType>) => void
}

const IssueArticleList = ({ articles, onRemove }: IssueArticleListProps) => {
  if (articles.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-col gap-2">
      {
        articles.map((i, idx) => (
          <li
            key={"issue-article-item-" + idx}
            className="p-2 rounded-md bg-yellow-500 flex font-bold align-middle justify-between gap-2"
          >
            {i.title}
            {onRemove && (
              <div className="my-auto">
                <HiXCircle className="cursor-pointer" onClick={() => onRemove(i)} />
              </div>
            )}
          </li>
        ))
      }
    </ul>
  )
}

export default IssueArticleList
