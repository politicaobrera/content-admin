import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import { AuthorType } from "@/app/types/author"
import getAuthor from "@/app/actions/data/authors/getAuthor"
import ErrorMessage from "@/app/components/ErrorMessage"
import AuthorForm from "../components/AuthorForm"

const AuthorPage = async ({
  params,
  searchParams,
} : {
  params: { id: string },
  searchParams : { [key: string]: string | string[] | undefined }
}) => {

  console.log("params", params)
  const {data, error}:iResponseOne<AuthorType> = await getAuthor(params.id)
  console.log("data", data)

  // TODO: replace error message with error page or widget and enque snackbar
  if (error) {
    return <ErrorMessage error={error}/>
  }

  // TODO: embellecer como en tabla similar mensaje de no hay articulo (404)
  if (!data) {
    return <div>No hay Articulo</div>
  }


  return (
    <MainContainer>
      <AuthorForm author={data}/>
    </MainContainer>
  )
}

export default AuthorPage