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
    console.log(`Error al editar el recurso ${data._id} (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al editar el recurso ${data._id}(${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editResource