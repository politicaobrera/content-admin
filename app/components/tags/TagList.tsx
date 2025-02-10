import { TagType } from "@/app/types/tag"
import { HiXCircle  } from 'react-icons/hi2'
interface TagListProps {
  tags: TagType[]
  onRemove?: (item:TagType) => void
}

const TagList = ({tags, onRemove}: TagListProps) => {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2">
      {
        tags.map((i, idx) => (
          <div
            key={"tag-item-"+idx}
            className="p-2 rounded-md bg-yellow-300 flex font-bold align-middle gap-2"
          >
            {i.name}
            {onRemove && (
              <div className="my-auto">
                <HiXCircle className="cursor-pointer" onClick={() => onRemove(i)}/>
              </div>
            )}
          </div>
        ))
      }
    </div>
  )
}

export default TagList