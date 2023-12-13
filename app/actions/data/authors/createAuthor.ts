'use server'
import { iResponseMany } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Author } from "@/app/authors/types/authors"

const authorsApi = process.env.CONTENT_SERVER_URL + '/authors'

const createAuthor = async function (data: Author):Promise<iResponseMany<Author>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('data',data);
  const response = await fetch(authorsApi,
   {
    headers: headers,
    cache: 'no-store',
    method: 'POST', 
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    console.log(`Error al crear el autor (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al crear el autor (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default createAuthor