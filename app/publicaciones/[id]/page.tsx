import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getPublication from "@/app/actions/data/publications/getPublication"
import ErrorMessage from "@/app/components/ErrorMessage"
import PublicationForm from "../components/PublicationForm"
import { PublicationType } from "@/app/types/publication"

const PublicationPage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {
  const {id} = await params
  const {data, error}:iResponseOne<PublicationType> = await getPublication(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Publicación</div>
  }

  return (
    <MainContainer>
      <PublicationForm publication={data}/>
    </MainContainer>
  )
}

export default PublicationPage
