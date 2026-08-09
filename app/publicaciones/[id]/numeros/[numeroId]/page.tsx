import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getIssue from "@/app/actions/data/issues/getIssue"
import getPublication from "@/app/actions/data/publications/getPublication"
import ErrorMessage from "@/app/components/ErrorMessage"
import { IssueType } from "@/app/types/issue"
import { PublicationType } from "@/app/types/publication"
import IssueForm from "../components/IssueForm"

const IssuePage = async ({
  params,
} : {
  params: Promise<{ id: string, numeroId: string }>,
}) => {
  const {id, numeroId} = await params
  const [{data, error}, {data: publicationData, error: publicationError}]:[iResponseOne<IssueType>, iResponseOne<PublicationType>] = await Promise.all([
    getIssue(numeroId),
    getPublication(id),
  ])

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Número</div>
  }

  if (publicationError) {
    return <ErrorMessage error={publicationError}/>
  }

  if (!publicationData) {
    return <div>No hay Publicación</div>
  }

  return (
    <MainContainer>
      <IssueForm publicationId={id} publicationSlug={publicationData.slug} issue={data}/>
    </MainContainer>
  )
}

export default IssuePage
