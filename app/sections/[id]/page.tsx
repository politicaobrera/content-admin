import { Suspense } from "react"
import SectionDetails from "../components/SectionDetails"
import MainContainer from "@/app/components/MainContainer"
import Loading from "@/app/components/Loading"
import { iResponse, iResponseId } from "@/types/Responses"
import { Section } from "../types/sections"
import getSectionById from "@/app/actions/data/sections/getSectionById"
import ErrorMessage from "@/app/components/ErrorMessage"
import SectionForm from "../components/SectionForm"
import { useParams } from "next/navigation"

const SectionIdPage = async ({
  params,
  searchParams,
} : {
  params: { id: string },
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  const {data, error}:iResponseId<Section> = await getSectionById(params.id)

  
  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div className="block h-full">
      <MainContainer>
        
        <Suspense fallback={<Loading />}>
         {
         data && 
         <>
            <SectionForm key={data._id} edit={true} editInfo={data}/>
            
         </>
         
         }
        </Suspense>

        
      </MainContainer>
    </div>
  )
}

export default SectionIdPage