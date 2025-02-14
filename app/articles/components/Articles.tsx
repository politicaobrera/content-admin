import getArticles from "@/app/actions/data/articles/getArticles"
import { iResponseMany } from "@/app/types/responses"
import { ArticleType } from "@/app/types/article"
import ErrorMessage from "@/app/components/ErrorMessage"
import ArticlesTable from "./ArticleTable"
import { Params } from "@/app/types/requests"

interface ArticlesProps {
  searchParams: Params;
}

const Articles:React.FC<ArticlesProps> = async ({searchParams}) => {
  const {data, error, meta}:iResponseMany<ArticleType> = await getArticles(searchParams)
  console.log("meta", meta)
  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div
      className="
        h-screen
      "
    >
      <ArticlesTable
        articles={data}
        meta={meta}
      />
    </div>
  )
}

export default Articles