import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getTag from "@/app/actions/data/tags/getTag"
import ErrorMessage from "@/app/components/ErrorMessage"
import TagForm from "../components/TagForm"
import { TagType } from "@/app/types/tag"

const TagPage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {

  const {id} = await params
  const {data, error}:iResponseOne<TagType> = await getTag(id)
  console.log("data", data)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Tag</div>
  }

  return (
    <MainContainer>
      <TagForm tag={data}/>
    </MainContainer>
  )
}

export default TagPage