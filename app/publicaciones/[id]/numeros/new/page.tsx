import MainContainer from "@/app/components/layout/MainContainer"
import IssueForm from "../components/IssueForm"

const NewIssuePage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {
  const { id } = await params
  return (
    <MainContainer>
      <IssueForm publicationId={id} />
    </MainContainer>
  )
}

export default NewIssuePage
