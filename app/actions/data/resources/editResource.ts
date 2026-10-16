'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { ResourceType } from "@/app/types/resource"

const resourceApi = process.env.CONTENT_SERVER_URL + '/resources'

const editResource = async function (data:Partial<ResourceType>):Promise<iResponseOne<ResourceType>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('data resource', data);
  const response = await fetch(`${resourceApi}/${data._id}`,
   {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH', 
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    // el backend manda un mensaje descriptivo en el body (ej: "falta subir un
    // archivo...") — sin leerlo, el toast siempre mostraba el genérico "Bad Request"
    const body = await response.json().catch(() => null)
    const message = body?.error || `Error al editar el recurso ${data._id} (${response.status}): ${response.statusText}`
    console.log(`Error al editar el recurso ${data._id} (${response.status}): ${message}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editResource