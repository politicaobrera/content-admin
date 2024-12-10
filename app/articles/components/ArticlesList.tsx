import getArticles from "@/app/actions/data/articles/getArticles"
import { iResponseMany } from "@/app/types/Responses"
import { ArticleType } from "@/app/types/articles"
import ErrorMessage from "@/app/components/ErrorMessage"
import ArticleListItem from "./ArticleListItem"
import ArticlesTable from "./ArticleTable"

const ArticlesList:React.FC = async () => {
  const {data, error, total}:iResponseMany<ArticleType> = await getArticles()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data || data?.length === 0) {
    return <div>No hay Articulos</div>
  }

  return (
    <div
      className="
        px-4
        py-8
        sm:px-6
        lg:px-8
        h-screen
        flex
      "
    >
      {/* <ul>
        {
          data?.map((article:ArticleType) => (
            <ArticleListItem
              article={article}
            />
          ))
        }
      </ul> */}
      <ArticlesTable 
        articles={data}
        total={total}
      />
    </div>
  )
}

export default ArticlesList