import getTags from "@/app/actions/data/tags/getTags"
import { iResponseMany } from "@/app/types/responses"
import { TagType } from "@/app/types/tag"
import ErrorMessage from "@/app/components/ErrorMessage"
import TagTable from "./TagTable"
import { Params } from "@/app/types/requests"

interface TagsProps {
  searchParams: Params;
}

const Tags:React.FC<TagsProps> = async ({searchParams}) => {
  const {data, error, meta}:iResponseMany<TagType> = await getTags(searchParams)
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
      <TagTable
        tags={data}
        meta={meta}
      />
    </div>
  )
}

export default Tags