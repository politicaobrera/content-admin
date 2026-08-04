import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getIssue from "@/app/actions/data/issues/getIssue"
import ErrorMessage from "@/app/components/ErrorMessage"
import { IssueType } from "@/app/types/issue"
import IssueForm from "../components/IssueForm"

const IssuePage = async ({
  params,
} : {
  params: Promise<{ id: string, numeroId: string }>,
}) => {
  const {id, numeroId} = await params
  const {data, error}:iResponseOne<IssueType> = await getIssue(numeroId)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Número</div>
  }

  return (
    <MainContainer>
      <IssueForm publicationId={id} issue={data}/>
    </MainContainer>
  )
}

export default IssuePage
