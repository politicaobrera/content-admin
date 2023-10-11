import { Suspense } from "react"
import MainContainer from "../components/MainContainer"
import SectionsList from "./components/SectionsList"
import Loading from "../components/Loading"

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
        >Secciones</h1>
        <Suspense fallback={<Loading />}>
          <SectionsList />
        </Suspense>
      </MainContainer>
    </div>
  )
}

export default SectionsPage