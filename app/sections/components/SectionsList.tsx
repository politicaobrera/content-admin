import getSections from "@/app/actions/data/sections/getSections"
import { iResponseMany } from "@/types/Responses"
import ErrorMessage from "@/app/components/ErrorMessage"
import SectionItem from "./SectionItem"
import Button from "@/app/components/Button"
import Link from "next/link"
import useSectionHook from "../hooks/useSectionHook"
import { useRouter } from "next/navigation"
import { Section } from "../types/sections"

const SectionsList:React.FC = async () => {
  const {data, error}:iResponseMany<Section> = await getSections()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <>
    {
    data?.length === 0 ? 
        <div>No hay Secciones</div>
        :   
      <div
        className="
          px-4
          py-8
          sm:px-6
          lg:px-8
          flex
          justify-center
          items-center
          bg-gray-100
        "
      >
        <div className="flex items-center text-center flex-col">     
          <ul>
          {    
            data?.map((section) => (
              <SectionItem
                key={section._id}
                section={section}
              />
            ))
          }
          </ul>
        </div>
      </div>
      }
      <div>
        <Link href={'sections/new'}>
          <Button>
              Crear Sección
          </Button>
        </Link>
      </div>
    </>
  )
}

export default SectionsList