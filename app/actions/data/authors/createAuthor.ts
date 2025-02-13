'use server'

import { AuthorType } from "@/app/types/author"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const authorApi = process.env.CONTENT_SERVER_URL + '/authors'

const createAuthor = async function (data:AuthorType):Promise<iResponseOne<AuthorType>> {
  try {
    const headers = await getAuthorizationHeader()
  
    const response = await fetch(
      authorApi,
      {
        headers: {...headers, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

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

export default createAuthor