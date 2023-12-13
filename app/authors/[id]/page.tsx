import { Suspense } from "react"
import MainContainer from "@/app/components/MainContainer"
import Loading from "@/app/components/Loading"
import ErrorMessage from "@/app/components/ErrorMessage"
import { Author } from "../types/authors"
import { iResponseMany } from "@/types/Responses"
import getAuthor from "@/app/actions/data/authors/getAuthor"
import AuthorForm from "../components/AuthorForm"

const AuthorPage = async ({
  params,
  searchParams,
} : {
  params: { id: string },
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  const {data, error}:iResponseMany<Author> = await getAuthor(params.id)
  
  if (error) {
    return <ErrorMessage error={error}/>
  }

  return (
    <div className="block h-full">
      <MainContainer>
        
        <Suspense fallback={<Loading />}>
         {
         data && 
         <>
            <AuthorForm key={data._id} edit={true} editInfo={data}/>
            
         </>
         
         }
        </Suspense>

        
      </MainContainer>
    </div>
  )
}

export default AuthorPage