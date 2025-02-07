'use server'

import { TagType } from "@/app/types/tag"
import { iResponseOne } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const tagApi = process.env.CONTENT_SERVER_URL + '/tags'

const createTag = async function (data:TagType):Promise<iResponseOne<TagType>> {
  try {
    const headers = await getAuthorizationHeader()
  
    const response = await fetch(
      tagApi,
      {
        headers: {...headers, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

    if(!response.ok) {
      console.log(`Error al crear el tag (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear el tag (${response.status}): ${response.statusText}`,
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

export default createTag