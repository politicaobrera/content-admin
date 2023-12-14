import getTags from "@/app/actions/data/tags/getTags"
import { iResponse } from "@/types/Responses"
import { Tag } from "@/types/tags"
import ErrorMessage from "@/app/components/ErrorMessage"

const SectionsList:React.FC = async () => {
  const {data, error}:iResponse<Tag> = await getTags()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (data?.length === 0) {
    return <div>No hay tags</div>
  }

  return (
    <div
      className="
        px-4
        py-8
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div className="flex items-center text-center flex-col">
        <ul>
          {
            data.map((tag) => <li>{tag.name}</li>)
          }
        </ul>
      </div>
    </div>
  )
}

export default SectionsList