'use server'

import { iResponse } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Section } from "@/app/sections/types/sections"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const editSection = async function (id:string, data: Section):Promise<iResponse<Section>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('id',id);
  console.log('data',data);
  // const response = await fetch(`${sectionsApi}/${id}`,
  //  {
  //   headers: headers,
  //   cache: 'no-store',
  //   method: 'PATCH', 
  //   body: JSON.stringify(data)
  // })

  

  // if(!response.ok) {
  //   console.log(`Error al editar la sección (${response.status}): ${response.statusText}`)
  //   return {
  //     error: {
  //       status: response.status,
  //       statusText: response.statusText,
  //       message: `Error al crear las secciones (${response.status}): ${response.statusText}`,
  //     },
  //     data: []
  //   }
  // }
  
  return {
    //data: await response.json()
    data: [data]
  }
}

export default editSection