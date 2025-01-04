'use server'

import { iResponseOne } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Section } from "@/app/types/sections"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const editSection = async function (id:string, data: Section):Promise<iResponseOne<Section>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('id',id);
  console.log('data',data);
  const response = await fetch(`${sectionsApi}/${id}`,
   {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH', 
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    console.log(`Error al editar la sección (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al crear las secciones (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editSection