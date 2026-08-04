import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Publications from "./components/Publications"
import Loading from "../components/Loading"
import { Params } from "../types/requests";

const PublicationsPage = async ({
  searchParams,
} : {
  searchParams : Promise<Params>,
}) => {
  const params = await searchParams
  return (
    <MainContainer>
      <section id="publications-page" className="flex flex-col gap-3 px-4">
        <h1 className="mt-6 text-center text-2xl text-black tracking-tight font-bold">
          Publicaciones
        </h1>
        <Suspense fallback={<Loading />}>
          <Publications searchParams={params}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default PublicationsPage
