'use server'

import { TagType } from "@/app/types/tag"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const tagApi = process.env.CONTENT_SERVER_URL + '/tags'

const getTag = async function (id:string):Promise<iResponseOne<TagType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${tagApi}/${id}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )
  
    if(!response.ok) {
      console.log(`Error al obtener el tag (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el tag (${response.status}): ${response.statusText}`,
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

export default getTag