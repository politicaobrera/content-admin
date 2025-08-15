import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getResource from "@/app/actions/data/resources/getResource"
import ErrorMessage from "@/app/components/ErrorMessage"
import ResourceForm from "../components/ResourceForm"
import { ResourceType } from "@/app/types/resource"

const ResourcePage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {
  const {id} = await params
  const {data, error}:iResponseOne<ResourceType> = await getResource(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Recurso</div>
  }


  return (
    <MainContainer>
      <ResourceForm resource={data}/>
    </MainContainer>
  )
}

export default ResourcePage