import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getWork from "@/app/actions/data/works/getWork"
import ErrorMessage from "@/app/components/ErrorMessage"
import WorkForm from "../components/WorkForm"
import { WorkType } from "@/app/types/work"

const WorkPage = async ({
  params,
}: {
  params: Promise<{ id: string }>,
}) => {

  const { id } = await params
  const { data, error }: iResponseOne<WorkType> = await getWork(id)

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return <div>No hay Obra</div>
  }

  return (
    <MainContainer>
      <WorkForm work={data} />
    </MainContainer>
  )
}

export default WorkPage
