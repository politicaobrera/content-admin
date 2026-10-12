import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import Campaigns from "./components/Campaigns"
import Loading from "../components/Loading"
import { Params } from "../types/requests";

const CampaignsPage = async ({
  searchParams,
} : {
  searchParams : Promise<Params>,
}) => {
  const paramas = await searchParams
  return (
    <MainContainer>
      <section id="campaigns-page" className="flex flex-col gap-3 px-4">
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
          Campañas
        </h1>
        <Suspense fallback={<Loading />}>
          <Campaigns searchParams={paramas}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default CampaignsPage
