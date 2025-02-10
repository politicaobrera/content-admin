import useAuthor from "@/app/authors/hooks/useAuthor"
import { AuthorType } from "@/app/types/author"
import { useRef, ChangeEvent, useState, useEffect } from "react"
import AuthorItem from "./AuthorItem"

interface AuthorSelectorProps {
  onChange: (authors:AuthorType[], descriptions: string[]) => void
  authors: AuthorType[]
  descriptions: string[]
}

const AuthorSelector = ({onChange, authors, descriptions}: AuthorSelectorProps) => {
  // factor out with hook
  const searchAuthorRef = useRef<HTMLInputElement>(null)
  // posiblemente no necesite estos currents y pueda manejarme directamente tocando la data en padre, revisar
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>(authors)
  const [currentDescriptions, setCurrentDescriptions] = useState<string[]>(descriptions)
  const [searchResults, setSearchResults] = useState<AuthorType[]>([])
  const {search} = useAuthor()

  useEffect(() => {
    onChange(currentAuthors, currentDescriptions)
  }, [currentAuthors, currentDescriptions])

  const handleSearchAuthorChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value
    if (q && q.length > 1) {
      const {data, error} = await search(q)
      if (error) {
        console.log("error al buscar", error)
      }
      if (data) {
        setSearchResults(data)
      }
    }
  }

  const handleAddAuthor = async (author:AuthorType) => {
    if (searchAuthorRef?.current?.value){
      searchAuthorRef.current.value = ''
    } 
    setSearchResults([])
    const alreadyAdded = currentAuthors.find(a => a.name === author.name)
    if(!alreadyAdded) {
      setCurrentAuthors(prev => prev.concat([author]))
      // use a map instead?
      setCurrentDescriptions(prev => prev.concat([""]))
    }
  }

  const handleDescriptionChange = async (author:AuthorType, description: string) => {
    const indice = currentAuthors.findIndex(ca => ca._id === author._id)
    const newDescriptions = [...currentDescriptions];
    newDescriptions[indice] = description;
    setCurrentDescriptions(newDescriptions)
  }

  return (
    <div className="flex flex-col gap-3">
      <h4>Autores</h4>
      <h6>Buscar</h6>
      <div>
        <input
          className="border-2 w-full"
          type="text"
          ref={searchAuthorRef}
          onChange={handleSearchAuthorChange}
        />
        {
          searchResults.length > 0 && (
            <ul className="border-2 border-black mt-1">
              {searchResults.map((i, idx) => {
                return (
                <li key={"author-result-"+idx} onClick={() => handleAddAuthor(i)}>
                  {i.name}
                </li>
                )
              })}
            </ul>
          )
        }
      </div>
      <div className="pt-2">
        {currentAuthors.map(((author, idx) => (
          <AuthorItem
            key={"selected-author-item"+idx}
            author={author}
            selectedDescription={currentDescriptions?.[idx]}
            onChange={handleDescriptionChange}
          />
        )))}
      </div>
    </div>
  )
}

export default AuthorSelector