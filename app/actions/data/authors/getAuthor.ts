'use server'
import { iResponseMany } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Author } from "@/app/authors/types/authors"

const authorsApi = process.env.CONTENT_SERVER_URL + '/authors'

const getAuthor = async function (id: string):Promise<iResponseMany<Author>> {
  // TODO changeit for get headers
  const headers = await getAuthorizationHeader()
  console.log("obteniendo", id)
  console.log("headers", headers)
  console.log("url", `${authorsApi}/${id}`)

  const response = await fetch(`${authorsApi}/${id}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener el autor (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener el autor (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getAuthor