import getSections from "@/app/actions/data/sections/getSections"
import { iResponseMany } from "@/app/types/responses"
import ErrorMessage from "@/app/components/ErrorMessage"
import SectionTable from "./SectionTable"
import { Section } from "../../types/sections"

const SectionsList:React.FC = async () => {
  const {data, error}:iResponseMany<Section> = await getSections()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  return <SectionTable sections={data ?? []} />
}

export default SectionsList