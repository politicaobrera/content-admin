'use server'

import { ResourceType } from "@/app/types/resource"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const resourceApi = process.env.CONTENT_SERVER_URL + '/resources'

const createResource = async function (data:ResourceType):Promise<iResponseOne<ResourceType>> {
  try {
    const headers = await getAuthorizationHeader()
  
    const response = await fetch(
      resourceApi,
      {
        headers: {...headers, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
      }
    )

    if(!response.ok) {
      console.log(`Error al crear el recurso (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear el recurso (${response.status}): ${response.statusText}`,
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

export default createResource