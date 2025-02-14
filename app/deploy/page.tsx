import { Suspense } from "react"
import Loading from "../components/Loading"
import MainContainer from "../components/layout/MainContainer"
import Deploy from "./components/Deploy"

const DeployPage = async ({
  searchParams,
} : {
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  return (
    <MainContainer>
      <section id="deploy-page" className="flex flex-col gap-3">
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
          Deploy
        </h1>
        <Suspense fallback={<Loading />}>
          <Deploy />
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default DeployPage