'use server'

import { ResourceType } from "@/app/types/resource"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const resourceApi = process.env.CONTENT_SERVER_URL + '/resources'

const deleteResource = async function (id:string):Promise<iResponseOne<ResourceType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${resourceApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if(!response.ok) {
      console.log(`Error al eliminar el recurso ${id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar el recurso ${id} (${response.status}): ${response.statusText}`,
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

export default deleteResource
