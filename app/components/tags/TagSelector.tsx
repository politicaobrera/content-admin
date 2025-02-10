import { ChangeEvent, useRef, useState } from "react"
import { TagType } from "@/app/types/tag"
import useTag from "@/app/tags/hooks/useTag"
import TagList from "./TagList"

interface TagSelectorProps {
  onChange: (tags:TagType[]) => void
  currentTags: TagType[]
}
const TagSelector = ({onChange, currentTags = []}: TagSelectorProps) => {
  const searchTagRef = useRef<HTMLInputElement>(null)
  const [searchResults, setSearchResults] = useState<TagType[]>([])
  const {searchByName} = useTag()

  const handleSearchTagChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value
    if (q && q.length > 1) {
      const {data, error} = await searchByName(q)
      if (error) {
        console.log("error al buscar", error)
      }
      if (data) {
        setSearchResults(data)
      }
    }
  }

  const handleAddTag = async (tag:TagType) => {
    if (searchTagRef?.current?.value){
      searchTagRef.current.value = ''
    } 
    setSearchResults([])
    const alreadyAdded = currentTags.find(a => a.name === tag.name)
    if(!alreadyAdded) {
      onChange([...currentTags, tag])
    }
  }

  const handleRemoveTag = async (tag:TagType) => {
    const alreadyAdded = currentTags.find(a => a.name === tag.name)
    if(alreadyAdded) {
      onChange(currentTags.filter(i => i._id !== tag._id))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Tags</h5>
      <div>
        <TagList
          tags={currentTags}
          onRemove={handleRemoveTag}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h6>Buscar</h6>
        <input
          type="text"
          className="w-full border-2"
          ref={searchTagRef}
          onChange={handleSearchTagChange}
        />
        {
          searchResults.length > 0 && (
            <ul className="border-2 border-black mt-1">
              {searchResults.map((i, idx) => {
                return (
                <li key={"author-result-"+idx} onClick={() => handleAddTag(i)}>
                  {i.name}
                </li>
                )
              })}
            </ul>
          )
        }
      </div>
    </div>
 )
}

export default TagSelector