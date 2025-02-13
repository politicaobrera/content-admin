import getResources from "@/app/actions/data/resources/getResources"
import { iResponseMany } from "@/app/types/responses"
import { ResourceType } from "@/app/types/resource"
import ErrorMessage from "@/app/components/ErrorMessage"
import TagTable from "./TagTable"
import { Params } from "@/app/types/requests"

interface ResourcesProps {
  searchParams: Params;
}

const Resources:React.FC<ResourcesProps> = async ({searchParams}) => {
  const {data, error, meta}:iResponseMany<ResourceType> = await getResources(searchParams)
  console.log("data", data)
  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div
      className="
        h-screen
      "
    >
      soy recursos
      {/* <TagTable
        tags={data}
        meta={meta}
      /> */}
    </div>
  )
}

export default Resources