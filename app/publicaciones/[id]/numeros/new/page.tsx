import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getPublication from "@/app/actions/data/publications/getPublication"
import ErrorMessage from "@/app/components/ErrorMessage"
import { PublicationType } from "@/app/types/publication"
import IssueForm from "../components/IssueForm"

const NewIssuePage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {
  const { id } = await params
  const {data, error}:iResponseOne<PublicationType> = await getPublication(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Publicación</div>
  }

  return (
    <MainContainer>
      <IssueForm publicationId={id} publicationSlug={data.slug} />
    </MainContainer>
  )
}

export default NewIssuePage
