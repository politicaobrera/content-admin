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
      // el backend manda un mensaje descriptivo en el body (ej: "falta subir un
      // archivo...") — sin leerlo, el toast siempre mostraba el genérico "Bad Request"
      const body = await response.json().catch(() => null)
      const message = body?.error || `Error al crear el recurso (${response.status}): ${response.statusText}`
      console.log(`Error al crear el recurso (${response.status}): ${message}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message,
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