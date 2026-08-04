'use server'

import { TagType } from "@/app/types/tag"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const tagApi = process.env.CONTENT_SERVER_URL + '/tags'

const deleteTag = async function (id:string):Promise<iResponseOne<TagType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${tagApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if(!response.ok) {
      console.log(`Error al eliminar el tag ${id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar el tag ${id} (${response.status}): ${response.statusText}`,
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

export default deleteTag
