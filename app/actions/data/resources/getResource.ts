'use server'

import { ResourceType } from "@/app/types/resource"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const resourceApi = process.env.CONTENT_SERVER_URL + '/resources'

const getResource = async function (id:string):Promise<iResponseOne<ResourceType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${resourceApi}/${id}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )
  
    if(!response.ok) {
      console.log(`Error al obtener el recurso (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el recurso (${response.status}): ${response.statusText}`,
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

export default getResource