import { iResponseMany } from "@/types/Responses"
import { Author } from "../types/authors"
import ErrorMessage from "@/app/components/ErrorMessage"
import getAuthors from "@/app/actions/data/authors/getAuthors"
import Link from "next/link"
import Button from "@/app/components/Button"
import AuthorItem from "./AuthorItem"


const SectionsList:React.FC = async () => {
  const {data, error}:iResponseMany<Author> = await getAuthors()

  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <>
    {
    data?.length === 0 ? 
        <div>No hay Autores</div>
        :   
      <div
        className="
          px-4
          py-8
          sm:px-6
          lg:px-8
          flex
          justify-center
          items-center
          bg-gray-100
        "
      >
        <div className="flex items-center text-center flex-col">     
          <ul>
          {    
            data?.map((author:Author) => (
              <AuthorItem
                key={author._id}
                author={author}
              />
            ))
          }
          </ul>
        </div>
      </div>
      }
      <div>
        <Link href={'authors/new'}>
          <Button>
              Crear Autor
          </Button>
        </Link>
      </div>
    </>
  )
}

export default SectionsList