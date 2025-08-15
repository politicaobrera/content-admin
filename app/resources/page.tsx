import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Resources from "./components/Resources"
import Loading from "../components/Loading"
import { Params } from "../types/requests";

const ResourcesPage = async ({
  searchParams,
} : {
  searchParams : Promise<Params>,
}) => {
  const params = await searchParams
  return (
    <MainContainer>
      <section id="resources-page" className="flex flex-col gap-3 px-4">
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
          Recursos
        </h1>
        <Suspense fallback={<Loading />}>
          <Resources searchParams={params}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default ResourcesPage