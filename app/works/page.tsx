import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Works from "./components/Works"
import Loading from "../components/Loading"
import NewWorkForm from "./components/NewWorkForm"
import { Params } from "../types/requests";

const WorksPage = async ({
  searchParams,
}: {
  searchParams: Promise<Params>,
}) => {
  const paramas = await searchParams
  return (
    <MainContainer>
      <section id="works-page" className="flex flex-col gap-3 px-4">
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
          Obras
        </h1>
        <NewWorkForm />
        <Suspense fallback={<Loading />}>
          <Works searchParams={paramas} />
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default WorksPage
