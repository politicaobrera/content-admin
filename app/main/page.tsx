import { Suspense } from "react"
import Portada from "./components/Portada"
import Loading from "../components/Loading"
import MainContainer from "../components/MainContainer"

const MainPage = async ({
  searchParams,
} : {
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  return (
    <MainContainer>
      <section id="main-page" className="flex flex-col gap-3 px-4">
        <Suspense fallback={<Loading />}>
          <Portada searchParams={searchParams} />
        </Suspense>
      </section>
    </MainContainer>
  )
/*   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-2 gap-y-3 grid-flow-row-dense">
        <div className="bg-red-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-orange-500 rounded-lg shadow-xl min-h-[50px] col-span-3 "/>
        <div className="bg-yellow-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-green-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-teal-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-blue-500 rounded-lg shadow-xl min-h-[50px] col-span-2 row-span-2"/>
        <div className="bg-indigo-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-purple-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-pink-500 rounded-lg shadow-xl min-h-[50px]"/>
        <div className="bg-slate-500 rounded-lg shadow-xl min-h-[50px]"/>
      </div>
  ) */
  /*       
        <MainContainer>
          <Image
            alt="Politica Obrera"
            width={300}
            height={300}
            className="
              max-w-sm
              rounded-2xl
              border 
              bg-white p-1 
              dark:border-neutral-700 
              dark:bg-neutral-800
              shadow-sm
              transition-shadow
              duration-300
              ease-in-out 
              hover:shadow-md 
              hover:shadow-black/30
              "
            src={pruebaPic}
          /> 
        </MainContainer> */
}

export default MainPage