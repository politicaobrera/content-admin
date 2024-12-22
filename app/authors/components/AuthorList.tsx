import getAuthors from "@/app/actions/data/authors/getAuthors"
import { iResponseMany } from "@/app/types/Responses"
import { AuthorType } from "@/app/types/author"
import ErrorMessage from "@/app/components/ErrorMessage"
import AuthorTable from "./AuthorTable"
import { Params } from "@/app/types/Requests"

interface AuthorsListProps {
  searchParams: Params;
}

const AuthorsList:React.FC<AuthorsListProps> = async ({searchParams}) => {
  const {data, error, total}:iResponseMany<AuthorType> = await getAuthors(searchParams)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div
      className="
        px-4
        py-8
        sm:px-6
        lg:px-8
        h-screen
        flex
      "
    >
      <AuthorTable 
        authors={data}
        total={total}
      />
    </div>
  )
}

export default AuthorsList