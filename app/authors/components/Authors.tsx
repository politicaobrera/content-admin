import getAuthors from "@/app/actions/data/authors/getAuthors"
import { iResponseMany } from "@/app/types/responses"
import { AuthorType } from "@/app/types/author"
import ErrorMessage from "@/app/components/ErrorMessage"
import AuthorTable from "./AuthorTable"
import { Params } from "@/app/types/requests"

interface AuthorsProps {
  searchParams: Params;
}

const Authors:React.FC<AuthorsProps> = async ({searchParams}) => {
  const {data, error, meta}:iResponseMany<AuthorType> = await getAuthors(searchParams)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  // TODO tiene que devolver data [] no tiene q ser optativa la data
  if(!data) {
    return(<div>No hay data</div>)
  }

  return (
    <div
      className="
        h-screen
      "
    >
      <AuthorTable 
        authors={data}
        meta={meta}
      />
    </div>
  )
}

export default Authors