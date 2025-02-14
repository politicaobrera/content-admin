import MainContainer from "@/app/components/layout/MainContainer"
import Loading from "@/app/components/Loading"
import { iResponseOne } from "@/app/types/responses"
import getTag from "@/app/actions/data/tags/getTag"
import ErrorMessage from "@/app/components/ErrorMessage"
import ResourceForm from "../components/ResourceForm"
import { TagType } from "@/app/types/tag"

const TagPage = async ({
  params,
  searchParams,
} : {
  params: { id: string },
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  // console.log("params", params)
  const {data, error}:iResponseOne<TagType> = await getTag(params.id)
  // console.log("data", data)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Tag</div>
  }


  return (
    <MainContainer>
      <ResourceForm tag={data}/>
    </MainContainer>
  )
}

export default TagPage