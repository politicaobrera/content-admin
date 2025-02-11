import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Tags from "./components/Tags"
import Loading from "../components/Loading"
import { Params } from "../types/Requests";

const TagsPage = ({
  searchParams,
} : {
  searchParams : Params
}) => {
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
          <Tags searchParams={searchParams}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default TagsPage