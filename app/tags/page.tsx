import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Tags from "./components/Tags"
import Loading from "../components/Loading"
import { Params } from "../types/requests";

const TagsPage = async ({
  searchParams,
} : {
  searchParams : Promise<Params>,
}) => {
  const paramas = await searchParams
  return (
    <MainContainer>
      <section id="tags-page" className="flex flex-col gap-3 px-4">
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
          Tags
        </h1>
        <Suspense fallback={<Loading />}>
          <Tags searchParams={paramas}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default TagsPage