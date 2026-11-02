import { ChangeEvent, useCallback, useRef, useState } from "react"
import { TagType } from "@/app/types/tag"
import useTag from "@/app/tags/hooks/useTag"
import TagList from "./TagList"
import useClickOutside from "@/app/hooks/useClickOutside"

interface TagSelectorProps {
  onChange: (tags:TagType[]) => void
  currentTags: TagType[]
  dontShowSearch?: boolean
  // false cuando el formulario ya pone su propio heading/label arriba (ej. un
  // Separator "Tags") o cuando este selector es un filtro auxiliar dentro de un
  // panel más grande que ya tiene su propio título -- mismo criterio que
  // SectionSelector.showLabel
  showTitle?: boolean
  // "Buscar" por defecto -- un panel con varios filtros juntos (título, sección, tag)
  // se beneficia de un label más específico, ej. "Buscar por tag", para que no haga
  // falta inferir qué busca este input en particular por el contexto
  searchLabel?: string
}
const TagSelector = ({onChange, currentTags = [], dontShowSearch = false, showTitle = true, searchLabel = "Buscar"}: TagSelectorProps) => {
  const searchTagRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [searchResults, setSearchResults] = useState<TagType[]>([])
  const {searchByName} = useTag()

  useClickOutside(searchContainerRef, useCallback(() => setSearchResults([]), []))

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
    } else {
      setSearchResults([])
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
    <div className="flex flex-col gap-2">
      {showTitle && <h5>Tags</h5>}
      {currentTags.length > 0 && (
        <TagList
          tags={currentTags}
          onRemove={handleRemoveTag}
        />
      )}
      <div className="relative" ref={searchContainerRef}>
        <div className="flex items-center gap-2">
          {!dontShowSearch && <label className="text-sm text-gray-600 shrink-0">{searchLabel}</label>}
          <input
            type="text"
            className="w-full border-2 border-gray-400 rounded-md p-1.5 text-gray-900"
            ref={searchTagRef}
            onChange={handleSearchTagChange}
          />
        </div>
        {
          searchResults.length > 0 && (
            <ul className="border-2 border-black rounded-md mt-1 overflow-hidden">
              {searchResults.map((i, idx) => {
                return (
                <li
                  key={"author-result-"+idx}
                  onMouseDown={() => handleAddTag(i)}
                  className="px-3 py-2 cursor-pointer text-gray-900 border-b border-gray-200 last:border-b-0 hover:bg-gray-100"
                >
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