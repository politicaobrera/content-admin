import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Articles from "./components/Articles"
import Loading from "../components/Loading"
import NewArticleForm from "./components/NewArticleForm";
import { Params } from "../types/requests";

const ArticlesPage = async ({
  searchParams,
} : {
  searchParams : Promise<Params>
}) => {
  const params = await searchParams
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
          <Articles searchParams={params}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default ArticlesPage