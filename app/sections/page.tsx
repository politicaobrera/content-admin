import { Suspense } from "react"
import MainContainer from "../components/layout/MainContainer"
import SectionsList from "./components/SectionsList"
import Loading from "../components/Loading"

const SectionsPage = () => {
  return (
    <MainContainer>
      <section id="section-page">
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
      </section>
    </MainContainer>
  )
}

export default SectionsPage