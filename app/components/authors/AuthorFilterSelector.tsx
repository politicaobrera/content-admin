'use client'

import { ChangeEvent, useCallback, useRef, useState } from "react"
import useAuthor from "@/app/authors/hooks/useAuthor"
import { AuthorType } from "@/app/types/author"
import useClickOutside from "@/app/hooks/useClickOutside"

interface AuthorFilterSelectorProps {
  currentAuthor: AuthorType | null
  onChange: (author: AuthorType | null) => void
  searchLabel?: string
}

// filtro de UN autor a la vez (no edición de autoría de una nota, eso es
// AuthorSelector) -- mismo patrón visual de buscar+dropdown que TagSelector, pero
// selección única: elegir otro autor reemplaza al actual en vez de acumularse
const AuthorFilterSelector = ({ currentAuthor, onChange, searchLabel = "Buscar por autor" }: AuthorFilterSelectorProps) => {
  const searchRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [searchResults, setSearchResults] = useState<AuthorType[]>([])
  const { search } = useAuthor()

  useClickOutside(searchContainerRef, useCallback(() => setSearchResults([]), []))

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value
    if (q && q.length > 1) {
      const { data, error } = await search(q)
      if (error) console.log("error al buscar autor", error)
      if (data) setSearchResults(data)
    } else {
      setSearchResults([])
    }
  }

  const handleSelect = (author: AuthorType) => {
    if (searchRef.current) searchRef.current.value = ""
    setSearchResults([])
    onChange(author)
  }

  if (currentAuthor) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-2.5 py-1.5 rounded-md border-2 border-black bg-white text-gray-900 flex items-center gap-2 font-bold">
          {currentAuthor.name}
          <button type="button" className="underline text-sm font-normal" onClick={() => onChange(null)}>
            Quitar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 shrink-0">{searchLabel}</label>
        <input
          type="text"
          className="w-full border-2 border-gray-400 rounded-md p-1.5 text-gray-900"
          ref={searchRef}
          onChange={handleSearchChange}
        />
      </div>
      {searchResults.length > 0 && (
        <ul className="border-2 border-black rounded-md mt-1 overflow-hidden">
          {searchResults.map((author) => (
            <li
              key={author._id}
              onMouseDown={() => handleSelect(author)}
              className="px-3 py-2 cursor-pointer text-gray-900 border-b border-gray-200 last:border-b-0 hover:bg-gray-100"
            >
              {author.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AuthorFilterSelector
