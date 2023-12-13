import { Suspense } from "react"
import MainContainer from "../components/MainContainer"

import Loading from "../components/Loading"
import AuthorsList from "./components/AuthorsList"

const SectionsPage = () => {
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
        >Autores</h1>
        <Suspense fallback={<Loading />}>
          <AuthorsList />
        </Suspense>
      </MainContainer>
    </div>
  )
}

export default SectionsPage