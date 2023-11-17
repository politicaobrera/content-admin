import { Suspense } from "react"
import SectionDetails from "../components/SectionDetails"
import MainContainer from "@/app/components/MainContainer"
import Loading from "@/app/components/Loading"
import { iResponse } from "@/types/Responses"
import { Section } from "../types/sections"
import getSectionById from "@/app/actions/data/sections/getSectionById"
import ErrorMessage from "@/app/components/ErrorMessage"
import SectionForm from "../components/SectionForm"

const SectionIdPage = async () => {

  const {data, error}:iResponse<Section> = await getSectionById('id')

  const section = data && data[0];
  
  if (error) {
    return <ErrorMessage error={error}/>
  }

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
        >Detalles</h1>
        <Suspense fallback={<Loading />}>
         {
         section && 
         <>
            <SectionDetails {...section}/>
            <SectionForm key={section.id} edit={true} editInfo={section}/>
         </>
         
         }
        </Suspense>
      </MainContainer>
    </div>
  )
}

export default SectionIdPage