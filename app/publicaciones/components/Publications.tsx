import getPublications from "@/app/actions/data/publications/getPublications"
import { iResponseMany } from "@/app/types/responses"
import { PublicationType } from "@/app/types/publication"
import ErrorMessage from "@/app/components/ErrorMessage"
import PublicationTable from "./PublicationTable"
import { Params } from "@/app/types/requests"

interface PublicationsProps {
  searchParams: Params;
}

const Publications:React.FC<PublicationsProps> = async ({searchParams}) => {
  const params = await searchParams
  const {data, error, meta}:iResponseMany<PublicationType> = await getPublications(params)
  if (error) {
    return <ErrorMessage error={error}/>
  }
  if(!data) {
    return(<div>No hay data</div>)
  }
  return (
    <div className="h-screen">
      <PublicationTable publications={data} meta={meta}/>
    </div>
  )
}

export default Publications
