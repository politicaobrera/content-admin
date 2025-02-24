import MainContainer from "@/app/components/layout/MainContainer"
import Loading from "@/app/components/Loading"
import { iResponseOne } from "@/app/types/responses"
import { ArticleType } from "@/app/types/article" 
import getArticle from "@/app/actions/data/articles/getArticle"
import ErrorMessage from "@/app/components/ErrorMessage"
import ArticleForm from "../components/ArticleForm"

const ArticlePage = async ({
  params,
  searchParams,
} : {
  params: { id: string },
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  // console.log("params", params)
  const {data, error}:iResponseOne<ArticleType> = await getArticle(params.id)
  // console.log("data", data)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Articulo</div>
  }


  return (
    <MainContainer>
      <ArticleForm article={data}/>
    </MainContainer>
  )
}

export default ArticlePage