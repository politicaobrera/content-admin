'use server'
import { iResponseMany } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Author } from "@/app/authors/types/authors"

const authorsApi = process.env.CONTENT_SERVER_URL + '/authors'

const getAuthors = async function ():Promise<iResponseMany<Author>> {
  const headers = await getAuthorizationHeader()
  const response = await fetch(authorsApi, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los autores (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los autores (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getAuthors