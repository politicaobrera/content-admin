import MainContainer from "../components/layout/MainContainer"
import PruebasView from "./PruebasView"

const PruebasPage = async () => {
   return (
    <MainContainer>
      <section id="pruebas-page" className="flex flex-col gap-3 px-4">
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
          Pruebas
        </h1>
        <PruebasView /> 
      </section>
    </MainContainer>
  )
}

export default PruebasPage