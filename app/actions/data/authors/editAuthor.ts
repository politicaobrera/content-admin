'use server'
import { Author } from "@/app/authors/types/authors"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { iResponseMany } from "@/types/Responses"

const authorsApi = process.env.CONTENT_SERVER_URL + '/authors'

const editAuthor = async function (id:string, data: Author):Promise<iResponseMany<Author>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('id',id);
  console.log('data',data);
  const response = await fetch(`${authorsApi}/${id}`,
   {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH', 
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    console.log(`Error al editar el autor (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al editar el autor (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editAuthor