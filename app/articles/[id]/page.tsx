import { Suspense } from "react"
import MainContainer from "@/app/components/MainContainer"
import Loading from "@/app/components/Loading"
import { iResponseOne } from "@/types/Responses"
import { Article } from "@/types/articles" 
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
  console.log("params", params)

  const {data, error}:iResponseOne<Article> = await getArticle(params.id)
  console.log("data", data)
  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Articulo</div>
  }


  return (
    <div className="block h-full">
      <MainContainer>
        <Suspense fallback={<Loading />}> 
         <>
            <ArticleForm article={data}/>
         </>
        </Suspense>
      </MainContainer>
    </div>
  )
}

export default ArticlePage