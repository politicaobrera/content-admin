import { Suspense } from "react"
import MainContainer from "../components/MainContainer"
import ArticlesList from "./components/ArticlesList"
import Loading from "../components/Loading"
import NewArticleForm from "./components/NewArticleForm";
import { Params } from "../types/Requests";

const ArticlesPage = ({
  searchParams,
} : {
  searchParams : Params
}) => {
  return (
    <MainContainer>
      <section id="article-page" className="flex flex-col gap-3 px-4">
        <h1
          className="
            mt-6
            text-center
            text-2xl
            text-black
            tracking-tight
            font-bold
          "
        >
          Notas
        </h1>
        <NewArticleForm />
        <Suspense fallback={<Loading />}>
          <ArticlesList searchParams={searchParams}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default ArticlesPage