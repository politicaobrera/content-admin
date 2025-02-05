import { Suspense } from "react"
import MainContainer from "../components/MainContainer"
//import AuthorList from "./components/AuthorList"
import Loading from "../components/Loading"
import { Params } from "../types/Requests";

const TagsPage = ({
  searchParams,
} : {
  searchParams : Params
}) => {
  return (
    <MainContainer>
      <section id="authors-list">
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
        {/* <Suspense fallback={<Loading />}>
          <AuthorList searchParams={searchParams}/>
        </Suspense> */}
      </section>
    </MainContainer>
  )
}

export default TagsPage