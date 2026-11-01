import getWorks from "@/app/actions/data/works/getWorks"
import { iResponseMany } from "@/app/types/responses"
import { WorkType } from "@/app/types/work"
import ErrorMessage from "@/app/components/ErrorMessage"
import WorkTable from "./WorkTable"
import { Params } from "@/app/types/requests"

interface WorksProps {
  searchParams: Params;
}

const Works: React.FC<WorksProps> = async ({ searchParams }) => {
  const { data, error, meta }: iResponseMany<WorkType> = await getWorks(searchParams)
  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return (<div>No hay data</div>)
  }

  return (
    <div
      className="
        h-screen
      "
    >
      <WorkTable
        works={data}
        meta={meta}
      />
    </div>
  )
}

export default Works
