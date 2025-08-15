import { Suspense } from "react"
import Portada from "./components/Portada"
import Loading from "../components/Loading"
import MainContainer from "../components/layout/MainContainer"

const MainPage = async ({
  searchParams,
} : {
  searchParams : Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams
  return (
    <MainContainer>
      <section id="main-page" className="flex flex-col gap-3 px-4">
        <Suspense fallback={<Loading />}>
          <Portada searchParams={params} />
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default MainPage