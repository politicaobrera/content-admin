import { ArticleType } from "@/app/types/article"
import { HiXCircle } from 'react-icons/hi2'
import ImageThumb from "@/app/components/image/ImageThumb"

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
            className="flex items-center gap-2 border-2 border-black rounded-md p-1 bg-gray-100"
          >
            <ImageThumb image={i.image} />
            <span className="font-semibold flex-1">{i.title}</span>
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
