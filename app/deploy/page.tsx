import { Suspense } from "react"
import Loading from "../components/Loading"
import MainContainer from "../components/MainContainer"
import Deploy from "./components/Deploy"

const DeployPage = async ({
  searchParams,
} : {
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  return (
    <MainContainer>
      <Suspense fallback={<Loading />}>
        <Deploy />
      </Suspense>
    </MainContainer>
  )
}

export default DeployPage