'use server'

import { AuthorType } from "@/app/types/author"
import { iResponseOne } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const authorApi = process.env.CONTENT_SERVER_URL + '/authors'

const getAuthor = async function (id:string):Promise<iResponseOne<AuthorType>> {
  // await setAuthCookie()
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${authorApi}/${id}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )
  
    if(!response.ok) {
      console.log(`Error al obtener el articulo (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el articulo (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return {
      data: res
    }
  } catch (error) {
    console.log(error)
    return {
      error: {
        status: 500,
        statusText: "Server Error",
        message: error as string,
      },
    }
  }
}

export default getAuthor