import { Suspense } from "react"
import MainContainer from "../components/MainContainer"
import ArticlesList from "./components/ArticlesList"
import Loading from "../components/Loading"
import NewArticleForm from "./components/NewArticleForm";

const ArticlesPage = () => {
  return (
    <div className="h-full bg-gray-100">
      <MainContainer>
        <section
        >
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
              <ArticlesList />
            </Suspense>
        </section>
      </MainContainer>
    </div>
  )
}

export default ArticlesPage