import getSections from "@/app/actions/data/sections/getSections"
import { iResponse } from "@/types/Responses"
import { Section } from "@/types/sections"
import ErrorMessage from "@/app/components/ErrorMessage"

const SectionsList:React.FC = async () => {
  const {data, error}:iResponse<Section> = await getSections()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (data?.length === 0) {
    return <div>No hay Secciones</div>
  }

  return (
    <div
      className="
        px-4
        py-8
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div className="flex items-center text-center flex-col">
        <ul>
          {
            data.map((section) => <li>{section.name}</li>)
          }
        </ul>
      </div>
    </div>
  )
}

export default SectionsList