import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Authors from "./components/Authors"
import Loading from "../components/Loading"
import { Params } from "../types/requests";

const AuthorsPage = ({
  searchParams,
} : {
  searchParams : Params
}) => {
  return (
    <MainContainer>
      <section id="authors-page" className="flex flex-col gap-3 px-4">
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
          Autores
        </h1>
        <Suspense fallback={<Loading />}>
          <Authors searchParams={searchParams}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default AuthorsPage