import { Suspense } from "react"
import MainContainer from "../components/MainContainer"
import TagsList from "./components/TagsList"
import Loading from "../components/Loading"

const TagsPage = () => {
  return (
    <div className="block h-full">
      <MainContainer>
        <h1
          className="
            mt-6
            text-center
            text-2xl
          text-black
            tracking-tight
            font-bold
          "
        >Tags</h1>
        <Suspense fallback={<Loading />}>
          <TagsList />
        </Suspense>
      </MainContainer>
    </div>
  )
}

export default TagsPage