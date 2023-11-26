import getArticles from "@/app/actions/data/articles/getArticles"
import { iResponse } from "@/types/Responses"
import { Article } from "@/types/articles"
import ErrorMessage from "@/app/components/ErrorMessage"

const ArticlesList:React.FC = async () => {
  const {data, error}:iResponse<Article> = await getArticles()

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
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div className="flex items-center text-center flex-col">
        <ul>
          {
            data.map((article) => <li>{article.title}</li>)
          }
        </ul>
      </div>
    </div>
  )
}

export default ArticlesList